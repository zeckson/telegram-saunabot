import { notifyAllAdmins } from "../../../util/notifier.ts"
import type { PhoneFlowContext } from '../phone-context.ts'
import { userSentContactAdminNotification } from '../phone.messages.ts'

export const notifyAdminsPhoneStep = async (ctx: PhoneFlowContext) => {
	if (!ctx.phone) return { ok: false, reason: 'missing_phone_in_ctx' }
	await notifyAllAdmins(
		ctx,
		userSentContactAdminNotification(ctx.user, ctx.phone),
	)

	return { ok: true }
}
