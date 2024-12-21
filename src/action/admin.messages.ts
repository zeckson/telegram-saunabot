import { blockquote, } from 'https://deno.land/x/grammy_parse_mode@1.10.0/format.ts'
import { fmt, FormattedString, link, mentionUser, } from '../deps.ts'
import { BotContext } from '../type/context.ts'

export class Messages {
  static chatJoinContactReceivedAdminNotification(
    ctx: BotContext,
    phone: string,
  ): FormattedString {
    const from = ctx.user

    const userLink = mentionUser(from.identity, from.id)
    const verifyLink = link(
      `ссылке`,
      `https://t.me/lolsbotcatcherbot?start=${from.id}`,
    )

    return fmt`Пользователь ${userLink} прислал свои контактные данные:
${blockquote(phone)}
Проверить пользователя можно по ${verifyLink}`
  }
}
