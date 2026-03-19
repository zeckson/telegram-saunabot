import { GrammyError } from "grammy"
import { AccessStore } from '../../../store/access-store.ts'
import { JoinRequestAction } from "../../../type/join-request.ts"
import { approveJoinRequestPipeline, toCallbackContext } from "../../callback/handle-callback-query.ts"
import { pipeline } from "../../pipeline.ts"
import { Step } from '../../sequence.type.ts'
import { PhoneFlowContext } from '../phone-context.ts'

export const autoApproveJoinRequestsStep: Step<PhoneFlowContext> = async (
	ctx,
) => {
	const userId = ctx.user.id
	const accessStore = new AccessStore(ctx.store)

	const pendingRequests = await accessStore.listPendingRequests(userId)
  const phone = ctx.phone
  const isRussian = phone?.startsWith('7') || phone?.startsWith('+7')

	if (pendingRequests.length === 0 || !isRussian) {
    if (!isRussian && pendingRequests.length > 0) {
      console.log(`User ${userId} with phone ${phone} is NOT Russian, skipping auto-approve`)
      await accessStore.clearRequests(userId)
    } else {
      console.log(`No pending requests for user ${userId}`)
    }
		return { ok: true }
	}

	const approvedChats = []
	for (const chat of pendingRequests) {
		try {
      await pipeline(`approve`, approveJoinRequestPipeline, true)(
        toCallbackContext(ctx, {
          action: JoinRequestAction.APPROVE,
          userId: userId,
          chatId: chat.id,
        }),
      )
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

  const approved = []
  for (const chat of approvedChats) {
    approved.push(accessStore.approve(ctx.user, chat))
  }
  await Promise.all(approved)

	if (approvedChats.length > 0) {
		ctx.approvedChats = approvedChats
	}

	await accessStore.clearRequests(userId)

	return { ok: true }
}
