import { notifyAdminsOnPhoneNumber } from "../../../action/admin.ts"
import type { PhoneFlowContext } from "../phone-context.ts"

export const notifyAdminsPhoneStep = async (ctx: PhoneFlowContext) => {
	if (!ctx.phone) return { ok: false, reason: 'missing_phone_in_ctx' }
	await notifyAdminsOnPhoneNumber(ctx, ctx.phone)
	return { ok: true }
}
