import { JoinRequestAction } from '../../type/join-request.ts'
import { pipeline } from '../pipeline.ts'
import { other, when } from '../when.ts'
import { CallbackContextFlow } from './callback-context.type.ts'
import { answerCallbackQueryStep } from './steps/answer-callback-query-step.ts'
import { extractActionStep } from './steps/extract-action-step.ts'
import {
	handleJoinRequestStep,
} from './steps/handle-join-request-step.ts'
import { notifyAdminsResultStep } from './steps/notify-admins-result-step.ts'

const fail = (reason: string) => () => ({ ok: false, reason })

export const approveJoinRequestPipeline = [
	handleJoinRequestStep,
	notifyAdminsResultStep,
]
export const declineJoinRequestPipeline = [
	handleJoinRequestStep,
	notifyAdminsResultStep,
]

const handleCallbackQueryData = pipeline(`callback-data`, [
	extractActionStep,
	when(
		(ctx: CallbackContextFlow) => ctx.data.action,
		{
			[JoinRequestAction.APPROVE]: approveJoinRequestPipeline,
			[JoinRequestAction.DECLINE]: declineJoinRequestPipeline,
			[other]: [fail(`unknown_action`)],
		},
	),
])

export const handleCallbackQuery = async (ctx: CallbackContextFlow) =>
	await answerCallbackQueryStep(await handleCallbackQueryData(ctx), ctx)
