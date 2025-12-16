// src/usecase/phone/steps/notify-admins-no-phone-step.ts
import { notifyAllAdmins } from "../../../action/admin.ts"
import { blockquote, fmt, link, mentionUser } from "../../../deps.ts"
import hashtag from "../../../util/hashtag.ts"
import type { Step } from "../../pipeline.ts"
import type { PhoneFlowContext } from "../phone-context.ts"

export const notifyAdminsNoPhoneStep: Step<PhoneFlowContext> = async (ctx) => {
  // This step is intended to run only when no phone/contact was provided.
  // Keep it defensive anyway:
  if (ctx.phone) return { ok: true }

  const from = ctx.user

  const userLink = mentionUser(from.identity, from.id)
  const verifyLink = link(
    `ссылке`,
    `https://t.me/lolsbotcatcherbot?start=${from.id}`,
  )

  const message = fmt`Заявка ${hashtag(from.id)}
Пользователь ${userLink} прислал сообщение:
${blockquote(ctx.message?.text ?? 'no text')}
Проверить пользователя можно по ${verifyLink}`

  await notifyAllAdmins(ctx, message)
  return { ok: true }
}
