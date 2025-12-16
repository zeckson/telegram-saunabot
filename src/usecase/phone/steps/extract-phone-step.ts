// src/usecase/phone/steps/extract-phone-step.ts
import type { Step } from "../../pipeline.ts"
import type { PhoneFlowContext } from "../phone-context.ts"
import { userContactResponse } from "../../../action/user.ts"

export const extractPhoneStep: Step<PhoneFlowContext> = async (ctx) => {
  ctx.phone = await userContactResponse(ctx) ?? undefined
  return { ok: true }
}
