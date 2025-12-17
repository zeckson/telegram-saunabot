import { run } from "../pipeline.ts"
import type { JoinFlowContext } from "./join-context.ts"
import { validateJoinRequestStep } from "./steps/validate-join-request-step.ts"
import { requestUserContactStep } from "./steps/request-user-contact-step.ts"

export const handleChatJoinRequest = (ctx: JoinFlowContext) =>
	run(`chat_join_request`, ctx, [
		validateJoinRequestStep,
		requestUserContactStep,
	])
