import { pipeline } from '../pipeline.ts'
import { answerCallbackQueryStep } from "./steps/answer-callback-query-step.ts"
import { CallbackContextFlow } from './callback-context.type.ts'
import { extractActionStep } from './steps/extract-action-step.ts'
import { handleJoinRequestStep } from './steps/handle-join-request-step.ts'
import { notifyAdminsResultStep } from './steps/notify-admins-result-step.ts'

const handleCallbackQueryData = pipeline(`callback-data`, [
	extractActionStep,
	handleJoinRequestStep,
	notifyAdminsResultStep,
])

export const handleCallbackQuery = async (ctx: CallbackContextFlow) =>
	await answerCallbackQueryStep(await handleCallbackQueryData(ctx), ctx)
