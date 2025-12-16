// src/usecase/phone/handle-phone-contact.ts
import { runPipeline, branch } from "../pipeline.ts"
import type { PhoneFlowContext } from "./phone-context.ts"
import { extractPhoneStep } from "./steps/extract-phone-step.ts"
import { savePhoneStep } from "./steps/save-phone-step.ts"
import { notifyAdminsPhoneStep } from "./steps/notify-admins-phone-step.ts"
import { notifyAdminsNoPhoneStep } from "./steps/notify-admins-no-phone-step.ts"

export const handleUserMessage = (ctx: PhoneFlowContext) =>
  runPipeline(ctx, [
    extractPhoneStep, // sets ctx.phone when present; does not stop the pipeline
    branch(
      (ctx) => Boolean(ctx.phone),
      [savePhoneStep, notifyAdminsPhoneStep],
      [notifyAdminsNoPhoneStep],
    ),
  ])
