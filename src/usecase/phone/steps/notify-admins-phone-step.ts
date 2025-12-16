// src/usecase/phone/steps/notify-admins-phone-step.ts
import type { Step } from "../../pipeline.ts"
import type { PhoneFlowContext } from "../phone-context.ts"
import { notifyAdminsOnPhoneNumber } from "../../../action/admin.ts"

export const notifyAdminsPhoneStep: Step<PhoneFlowContext> = async (ctx) => {
  if (!ctx.phone) return { ok: false, reason: "missing_phone_in_ctx" }
  await notifyAdminsOnPhoneNumber(ctx, ctx.phone)
  return { ok: true }
}
