import { JoinRequestAction } from '../../../action/admin.ts'
import { StepOutcome } from "../../sequence.type.ts"
import { CallbackContextFlow } from '../callback-context.type.ts'

export const handleJoinRequestStep = async (
	ctx: CallbackContextFlow,
): Promise<StepOutcome> => {
	const action = ctx.data.action
	const chatId = ctx.data.chatId
	const userId = ctx.data.userId
	try {
		switch (action) {
			case JoinRequestAction.APPROVE:
				await ctx.api.approveChatJoinRequest(chatId, userId)
				return { ok: true }
			case JoinRequestAction.DECLINE:
				await ctx.api.declineChatJoinRequest(chatId, userId)
				return { ok: true }
			default:
				return { ok: false, reason: 'unknown_action' }
		}
	} catch (e: Error | unknown) {
		return { ok: false, reason: e as Error }
	}
}
