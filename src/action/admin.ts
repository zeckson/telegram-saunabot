import {
	ChatJoinRequest,
	FormattedString,
	GrammyError,
	InlineKeyboard,
} from '../deps.ts'
import { AccessStore } from '../store/access-store.ts'
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

export const validateJoinRequest = async (
	ctx: BotContext & ChatJoinRequest,
): Promise<boolean> => {
	const chat = ctx.chat
	const from = ctx.user
	const updateId = ctx.update.update_id

	const accessStore = new AccessStore(ctx.store)
	await accessStore.request(from, chat)

	const keyboard = new InlineKeyboard()

	const info = await getBanInfo(ctx.user.id)
	const banned = info.length > 0
	if (banned) {
		await handleJoinRequest(
			ctx,
			JoinRequestAction.DECLINE,
			ctx.chat.id,
			ctx.user.id,
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

const notifyApproved = (ctx: BotContext, userId: number) =>
	notifyAllAdmins(
		ctx,
		Messages.notifyJoinApproved(ctx, userId),
	)

const notifyRejected = (ctx: BotContext, userId: number) =>
	notifyAllAdmins(
		ctx,
		Messages.notifyJoinRejected(ctx, userId),
	)

const notifyErrored = async (
	ctx: BotContext,
	userId: number,
	e: GrammyError,
) => {
	console.error(`Got error: `, e)
	try {
		return await notifyAllAdmins(
			ctx,
			Messages.notifyError(ctx, userId, e),
		)
	} catch (err) {
		return console.error(`Failed to notify: `, err)
	}
}

const handleJoinRequest = async (
	ctx: BotContext,
	action: JoinRequestAction,
	chatId: number,
	userId: number,
): Promise<void> => {
	try {
		switch (action) {
			case JoinRequestAction.APPROVE:
				await ctx.api.approveChatJoinRequest(chatId, userId)
				await notifyApproved(ctx, userId)
				break
			case JoinRequestAction.DECLINE:
				await ctx.api.declineChatJoinRequest(chatId, userId)
				await notifyRejected(ctx, userId)
				break
			default:
				console.error(`Unknown action: ${action}`)
		}
	} catch (e) {
		await notifyErrored(ctx, userId, e as GrammyError)
	}
}

export const declineUserJoinRequest = async (
	ctx: BotContext & ChatJoinRequest,
	text: FormattedString,
) => {
	await handleJoinRequest(
		ctx,
		JoinRequestAction.DECLINE,
		ctx.chat.id,
		ctx.user.id,
	)

	return notifyAllAdmins(ctx, text, {
		link_preview_options: { is_disabled: true },
		disable_notification: true,
		entities: text.entities,
	})
}

export const handleJoinAction = async (ctx: BotContext): Promise<string> => {
	const data = ctx.callbackQuery?.data ?? ``
	const [actionValue, chatId, userId, _updateId] = data.split(`:`)
	const action = actionValue as JoinRequestAction

	await handleJoinRequest(ctx, action, int(chatId), int(userId))

	return Messages.chatJoinAction(action)
}
