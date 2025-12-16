import type { Step } from "../../pipeline.ts"
import type { JoinFlowContext } from "../join-context.ts"
import { validateJoinRequest } from "../../../action/admin.ts"

export const validateJoinRequestStep: Step<JoinFlowContext> = async (ctx) => {
	const banned = await validateJoinRequest(ctx)
	if (banned) return { ok: false, reason: "banned" }
	return { ok: true }
}
