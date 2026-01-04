import { Messages } from "../../../action/admin.messages.ts"
import { notifyAllAdmins } from "../../../action/admin.ts"
import type { PhoneFlowContext } from "../phone-context.ts"

export const notifyAdminsPhoneStep = async (ctx: PhoneFlowContext) => {
	if (!ctx.phone) return { ok: false, reason: 'missing_phone_in_ctx' }
	const message = Messages.chatJoinContactReceivedAdminNotification(
		ctx,
		ctx.phone,
	)

	await notifyAllAdmins(ctx, message)

	return { ok: true }
}
