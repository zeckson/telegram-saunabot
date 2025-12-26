import { Step } from "../../sequence.type.ts"
import type { JoinFlowContext } from "../join-context.ts"
import { Messages } from "../../../action/admin.messages.ts"
import { notifyAllAdmins } from "../../../action/admin.ts"
import { requestUserContact } from "../../../action/user.ts"
import type { GrammyError } from "../../../deps.ts"

export const requestUserContactStep: Step<JoinFlowContext> = async (ctx) => {
	try {
		await requestUserContact(ctx)
		return { ok: true }
	} catch (e: unknown) {
		await notifyAllAdmins(
			ctx,
			Messages.requestContactError(ctx, e as GrammyError),
		)
		return { ok: false, reason: "request_contact_failed" }
	}
}
