import {
	ChatJoinRequest,
	FormattedString,
	GrammyError,
	InlineKeyboard,
} from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { int } from '../util/system.ts'
import { Messages } from './admin.messages.ts'
import { getBanInfo } from './ban.ts'
import { notifyAdmins } from './notify-admin.ts'

export const enum JoinRequestAction {
	APPROVE = `approve`,
	DECLINE = `decline`,
}

export const notifyAllAdmins = (
	ctx: BotContext,
	message: string | FormattedString,
	other?: object,
) => {
	let params: object = {}
	if (message instanceof FormattedString) {
		params = { entities: message.entities, ...other }
		message = message.toString()
	} else {
		params = { parse_mode: 'MarkdownV2', ...other }
	}
	return notifyAdmins((id: number) =>
		ctx.api.sendMessage(id, message as string, {
			link_preview_options: { is_disabled: true },
			...params,
		})
	)
}

export const notifyAdminsOnPhoneNumber = (ctx: BotContext, phone: string) => {
	const message = Messages.chatJoinContactReceivedAdminNotification(
		ctx,
		phone,
	)

	return notifyAllAdmins(ctx, message, {
		link_preview_options: { is_disabled: true },
	})
}

export const validateJoinRequest = async (
	ctx: BotContext & ChatJoinRequest,
): Promise<boolean> => {
	const chat = ctx.chat
	const from = ctx.user
	const updateId = ctx.update.update_id

	const keyboard = new InlineKeyboard()

	const info = await getBanInfo(ctx.user.id)
  const banned = info.length > 0
  if (banned) {
		handleJoinRequest(
			ctx,
			JoinRequestAction.DECLINE,
			ctx.chat.id,
			ctx.user.id,
			String(ctx.update.update_id),
		)
	} else {
		keyboard.add(InlineKeyboard.text(
			Messages.approveButtonText,
			`${JoinRequestAction.APPROVE}:${chat.id}:${from.id}:${updateId}`,
		))
		keyboard.add(InlineKeyboard.text(
			Messages.declineButtonText,
			`${JoinRequestAction.DECLINE}:${chat.id}:${from.id}:${updateId}`,
		))
	}

	await notifyAllAdmins(ctx, Messages.onJoinRequest(ctx, info), {
		link_preview_options: { is_disabled: true },
		reply_markup: keyboard,
	})
  return banned
}

const notifyApproved = (ctx: BotContext, updateId: string) => () =>
	notifyAllAdmins(
		ctx,
		Messages.notifyJoinApproved(ctx, updateId),
	)

const notifyRejected = (ctx: BotContext, updateId: string) => () =>
	notifyAllAdmins(
		ctx,
		Messages.notifyJoinRejected(ctx, updateId),
	)

const notifyErrored =
	(ctx: BotContext, updateId: string) => async (e: GrammyError) => {
		console.error(`Got error: `, e)
		try {
			return await notifyAllAdmins(
				ctx,
				Messages.notifyError(ctx, updateId, e),
			)
		} catch (err) {
			return console.error(`Failed to notify: `, err)
		}
	}

const handleJoinRequest = (
	ctx: BotContext,
	action: JoinRequestAction,
	chatId: number | string,
	userId: number,
	updateId: string,
): void => {
	switch (action) {
		case JoinRequestAction.APPROVE:
			ctx.api.approveChatJoinRequest(chatId, userId)
				.then(notifyApproved(ctx, updateId)).catch(
					notifyErrored(ctx, updateId),
				)
			break
		case JoinRequestAction.DECLINE:
			ctx.api.declineChatJoinRequest(chatId, userId)
				.then(notifyRejected(ctx, updateId)).catch(
					notifyErrored(ctx, updateId),
				)
			break
		default:
			console.error(`Unknown action: ${action}`)
	}
}

export const declineUserJoinRequest = (
	ctx: BotContext & ChatJoinRequest,
	text: FormattedString,
) => {
	handleJoinRequest(
		ctx,
		JoinRequestAction.DECLINE,
		ctx.chat.id,
		ctx.user.id,
		String(ctx.update.update_id),
	)

	return notifyAllAdmins(ctx, text, {
		link_preview_options: { is_disabled: true },
		disable_notification: true,
		entities: text.entities,
	})
}

export const handleJoinAction = (ctx: BotContext): string => {
	const data = ctx.callbackQuery?.data ?? ``
	const [actionValue, chatId, userId, updateId] = data.split(`:`)
	const action = actionValue as JoinRequestAction

	handleJoinRequest(ctx, action, chatId, int(userId), updateId)

	return Messages.chatJoinAction(action)
}
