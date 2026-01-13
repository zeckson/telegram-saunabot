import { CallbackQuery } from "grammy/types"
import { JoinRequestAction } from "../../../action/admin.ts"
import { declineJoinRequestPipeline } from "../../callback/handle-callback-query.ts"
import { pipeline } from "../../pipeline.ts"
import { Step } from '../../sequence.type.ts'
import { JoinFlowContext } from '../join-context.ts'

export const rejectRequestIfBanned: Step<JoinFlowContext> = async (ctx) => {
	const declinePipeline = pipeline(`reject`, declineJoinRequestPipeline)
	await declinePipeline(Object.assign(ctx, {
		data: {
			action: JoinRequestAction.DECLINE,
			userId: ctx.user.id,
			chatId: ctx.chat.id,
		},
	}))

	return { ok: false, reason: 'banned' }
}
