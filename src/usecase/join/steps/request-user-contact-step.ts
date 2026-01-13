import { notifyAllAdmins } from '../../../action/admin.ts'
import { GrammyError, Keyboard } from '../../../deps.ts'
import { Step } from '../../sequence.type.ts'
import type { JoinFlowContext } from '../join-context.ts'
import {
	chatJoinVerifyMessage,
	requestContactError,
	shareContactButtonName,
} from '../join.messages.ts'

export const requestUserContactStep: Step<JoinFlowContext> = async (ctx) => {
	try {
		const message = chatJoinVerifyMessage(ctx.user, ctx.chat)
		await ctx.api.sendMessage(
			ctx.user_chat_id ?? ctx.from.id,
			message.text,
			{
				link_preview_options: { is_disabled: true },
				entities: message.entities,
				reply_markup: {
					keyboard: [[
						Keyboard.requestContact(shareContactButtonName),
					]],
					is_persistent: true,
				},
			},
		)
		return { ok: true }
	} catch (e: unknown) {
		await notifyAllAdmins(
			ctx,
			requestContactError(ctx.user, (e as GrammyError).message),
		)
		return { ok: false, reason: 'request_contact_failed' }
	}
}
