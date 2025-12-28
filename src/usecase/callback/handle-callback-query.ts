import { JoinRequestAction } from '../../action/admin.ts'
import { pipeline } from '../pipeline.ts'
import { other, when } from '../when.ts'
import { CallbackContextFlow } from './callback-context.type.ts'
import { answerCallbackQueryStep } from './steps/answer-callback-query-step.ts'
import { extractActionStep } from './steps/extract-action-step.ts'
import { handleJoinRequestApproveStep, handleJoinRequestDeclineStep, } from './steps/handle-join-request-step.ts'
import { notifyAdminsApprovedStep, notifyAdminsRejectedStep, } from './steps/notify-admins-result-step.ts'

const fail = (reason: string) => () => ({ ok: false, reason })

const handleCallbackQueryData = pipeline(`callback-data`, [
	extractActionStep,
	when(
		(ctx: CallbackContextFlow) => ctx.data.action,
		{
			[JoinRequestAction.APPROVE]: [
				handleJoinRequestApproveStep,
				notifyAdminsApprovedStep,
			],
			[JoinRequestAction.DECLINE]: [
				handleJoinRequestDeclineStep,
				notifyAdminsRejectedStep,
			],
			[other]: [fail(`unknown_action`)],
		},
	),
])

export const handleCallbackQuery = async (ctx: CallbackContextFlow) =>
	await answerCallbackQueryStep(await handleCallbackQueryData(ctx), ctx)
