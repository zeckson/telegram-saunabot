import { GrammyError } from "grammy"
import { AccessStore } from '../../../store/access-store.ts'
import { Step } from '../../sequence.type.ts'
import { PhoneFlowContext } from '../phone-context.ts'

export const autoApproveJoinRequestsStep: Step<PhoneFlowContext> = async (
	ctx,
) => {
	const userId = ctx.user.id
	const accessStore = new AccessStore(ctx.store)

	const pendingRequests = await accessStore.listPendingRequests(userId)

	if (pendingRequests.length === 0) {
    console.log(`No pending requests for user ${userId}`)
		return { ok: true }
	}

	const approvedChats = []
	for (const chat of pendingRequests) {
		try {
			await ctx.api.approveChatJoinRequest(chat.id, userId)
			await accessStore.approve(ctx.user, chat)
			approvedChats.push(chat)
		} catch (e) {
			if (e instanceof GrammyError) {
				await accessStore.error(ctx.user, chat, e)
			}
			console.error(
				`Failed to auto-approve user ${userId} in chat ${chat.id}:`,
				e,
			)
		}
	}

	if (approvedChats.length > 0) {
		ctx.approvedChats = approvedChats
	}

	await accessStore.clearRequests(userId)

	return { ok: true }
}
