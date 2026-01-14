import { JoinRequestAction } from '../../../type/join-request.ts'
import { StepOutcome } from '../../sequence.type.ts'
import { CallbackContextFlow } from '../callback-context.type.ts'

export const handleJoinRequestStep = async (
	ctx: CallbackContextFlow,
): Promise<StepOutcome> => {
	const chatId = ctx.data.chatId
	const userId = ctx.data.userId
	try {
		switch (ctx.data.action) {
			case JoinRequestAction.APPROVE:
				await ctx.api.approveChatJoinRequest(chatId, userId)
				break
			case JoinRequestAction.DECLINE:
				await ctx.api.declineChatJoinRequest(chatId, userId)
				break
			default:
				return {
					ok: false,
					reason: `invalid action: ${ctx.data.action}`,
				}
		}
		return { ok: true }
	} catch (e: unknown) {
		const error = e instanceof Error ? e : new Error(String(e))
		return { ok: false, error }
	}
}
