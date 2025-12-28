import { StepOutcome } from '../../sequence.type.ts'
import { CallbackContextFlow } from '../callback-context.type.ts'

export const handleJoinRequestApproveStep = async (
	ctx: CallbackContextFlow,
): Promise<StepOutcome> => {
	const chatId = ctx.data.chatId
	const userId = ctx.data.userId
	try {
		await ctx.api.approveChatJoinRequest(chatId, userId)
		return { ok: true }
	} catch (e: Error | unknown) {
		return { ok: false, reason: e as Error }
	}
}

export const handleJoinRequestDeclineStep = async (
	ctx: CallbackContextFlow,
): Promise<StepOutcome> => {
	const chatId = ctx.data.chatId
	const userId = ctx.data.userId
	try {
		await ctx.api.declineChatJoinRequest(chatId, userId)
		return { ok: true }
	} catch (e: Error | unknown) {
		return { ok: false, reason: e as Error }
	}
}
