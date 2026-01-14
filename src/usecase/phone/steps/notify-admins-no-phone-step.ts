import { notifyAllAdmins } from "../../../util/notifier.ts"
import { Step } from '../../sequence.type.ts'
import type { PhoneFlowContext } from '../phone-context.ts'
import { userSentMessageNoContactAdminNotification } from '../phone.messages.ts'

export const notifyAdminsNoPhoneStep: Step<PhoneFlowContext> = async (ctx) => {
	// This step is intended to run only when no phone/contact was provided.
	// Keep it defensive anyway:
	if (ctx.phone) return { ok: true }

	await notifyAllAdmins(
		ctx,
		userSentMessageNoContactAdminNotification(ctx.user, ctx.message),
	)
	return { ok: true }
}
