import { InlineKeyboard } from '../../../deps.ts'
import { Messages } from '../../../action/admin.messages.ts'
import { JoinRequestAction, notifyAllAdmins } from '../../../action/admin.ts'
import { Step } from '../../sequence.type.ts'
import { BanStatus, JoinFlowContext } from '../join-context.ts'
import { onJoinRequest } from '../join.messages.ts'

export const notifyAdminsJoinRequestStep: Step<JoinFlowContext> = async (
	ctx,
) => {
	const chat = ctx.chat
	const from = ctx.user
	const updateId = ctx.update.update_id

	const banData = ctx.banStatus ?? {
		status: BanStatus.UNKNOWN,
		info: [],
	}

	const keyboard = new InlineKeyboard()
	if (banData.status !== BanStatus.BANNED) {
		keyboard.add(InlineKeyboard.text(
			Messages.approveButtonText,
			`${JoinRequestAction.APPROVE}:${chat.id}:${from.id}:${updateId}`,
		))
		keyboard.add(InlineKeyboard.text(
			Messages.declineButtonText,
			`${JoinRequestAction.DECLINE}:${chat.id}:${from.id}:${updateId}`,
		))
	}

	await notifyAllAdmins(ctx, onJoinRequest(from, chat, banData), {
		link_preview_options: { is_disabled: true },
		reply_markup: keyboard,
	})

	return { ok: true }
}
