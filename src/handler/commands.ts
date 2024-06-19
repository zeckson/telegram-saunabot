import { Bot } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { escapeSpecial } from "../util/string.ts"
import { getFullName } from "../util/username.ts"

export const register = (bot: Bot<BotContext>) => {
  bot.command(`start`, (ctx: BotContext) => {
    return ctx.reply(ctx.t(`commands_greeting-test`))
  })
  bot.command(`test`, (ctx: BotContext) => {
    // Check broken parse_mode with fluent context
    const from = ctx.from!
    const chat = ctx.chat!

    const safeChatTitle = escapeSpecial(chat.title || chat.type)
    return ctx.reply(ctx.t(`chat-join-request_admin-notify-text`, {
        userLink: `[${getFullName(from)}](tg://user?id=${from.id})`,
        chatLink: chat.username ? `[${safeChatTitle}](tg://resolve?domain=${chat.username})` : safeChatTitle,
        verifyLink: `[ссылке](https://t.me/lolsbotcatcherbot?start=${from.id})`,
      }
    ), {
      link_preview_options: { is_disabled: true },
      parse_mode: `MarkdownV2`
    })
  })
}
