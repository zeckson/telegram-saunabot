import { pipeline } from '../pipeline.ts'
import type { JoinFlowContext } from './join-context.ts'
import { requestUserContactStep } from './steps/request-user-contact-step.ts'
import { validateJoinRequestStep } from './steps/validate-join-request-step.ts'

const joinFlowPipeline = pipeline<JoinFlowContext>(`chat_join_request`, [
	validateJoinRequestStep,
	requestUserContactStep,
])

export const handleChatJoinRequest = (ctx: JoinFlowContext) =>
	joinFlowPipeline(ctx)
