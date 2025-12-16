import { runPipeline } from "../pipeline.ts"
import type { JoinFlowContext } from "./join-context.ts"
import { validateJoinRequestStep } from "./steps/validate-join-request-step.ts"
import { requestUserContactStep } from "./steps/request-user-contact-step.ts"

export const handleChatJoinRequest = (ctx: JoinFlowContext) =>
	runPipeline(ctx, [
		validateJoinRequestStep,
		requestUserContactStep,
	])
