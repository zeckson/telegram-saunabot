// src/usecase/phone/steps/notify-admins-no-phone-step.ts
import type { Step } from "../../pipeline.ts"
import type { PhoneFlowContext } from "../phone-context.ts"
import { notifyAllAdmins } from "../../../action/admin.ts"

export const notifyAdminsNoPhoneStep: Step<PhoneFlowContext> = async (ctx) => {
  // This step is intended to run only when no phone/contact was provided.
  // Keep it defensive anyway:
  if (ctx.phone) return { ok: true }

  const from = ctx.user
  const chat = ctx.chat

  const message =
    `⚠️ No phone/contact received\n` +
    `User: ${from.first_name}${from.last_name ? ` ${from.last_name}` : ``} (@${
      from.username ?? `no_username`
    }, id=${from.id})\n` +
    `Chat: ${chat?.title ?? `unknown`} (id=${chat?.id ?? `unknown`})\n` +
    `Message: ${ctx.message?.text ?? 'no text'}\n` +
    `Update: ${ctx.update.update_id}`

  await notifyAllAdmins(ctx, message)
  return { ok: true }
}
