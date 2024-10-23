import { notifyAdminsOnJoinRequest } from "../action/admin.ts"
import { requestUserContact } from "../action/user.ts"
import { Bot, ChatJoinRequest } from '../deps.ts'
import { emojis } from "../util/emoji.ts"
import { BotContext } from '../type/context.ts'
import { escapeCommon } from "../util/markdown.ts"
import { escapeSpecial, hash, link, tgIdLink } from '../util/string.ts'
import { getFullName } from '../util/username.ts'

export const register = (bot: Bot<BotContext>) => {
  bot.command(`start`, (ctx: BotContext) => {
    return ctx.reply(ctx.t(`commands_greeting-test`))
  })
  bot.command(`test`, (ctx: BotContext) => {
    // Check broken parse_mode with fluent context
    const from = ctx.from!
    const chat = ctx.chat!

    const safeChatTitle = escapeSpecial(chat.title || chat.type)
    return ctx.reply(
      ctx.t(`chat-join-request_admin-notify-text`, {
        userLink: `[${getFullName(from)}](tg://user?id=${from.id})`,
        chatLink: chat.username
          ? `[${safeChatTitle}](tg://resolve?domain=${chat.username})`
          : safeChatTitle,
        verifyLink: `[ссылке](https://t.me/lolsbotcatcherbot?start=${from.id})`,
      }),
      {
        link_preview_options: { is_disabled: true },
        parse_mode: `MarkdownV2`,
      },
    )
  })
  bot.command("md2", async (ctx) => {
    // `item` will be "apple pie" if a user sends "/md2 apple pie".
    const item = ctx.match;
    return ctx.reply(escapeCommon(item), {parse_mode: `MarkdownV2`})
  });
  bot.command(
    `notify`,
    (ctx: BotContext) =>
      notifyAdminsOnJoinRequest(
        Object.assign(ctx, {
          bio: '',
          date: 0,
          invite_link: undefined,
          user_chat_id: ctx.chat!.id,
        }) as BotContext & ChatJoinRequest,
      ),
  )
  bot.command(
    `phone`,
    (ctx: BotContext) =>
      requestUserContact(
        Object.assign(ctx, {
          bio: '',
          date: 0,
          invite_link: undefined,
          user_chat_id: ctx.chat!.id,
        }) as BotContext & ChatJoinRequest,
      ),
  )

  bot.command('demo', async (ctx) => {
    await ctx.reply(`*This* is _the_ default \`formatting\` ${emojis.robot}`, {parse_mode: 'MarkdownV2'})
    await ctx.replyT(`chat-join-request_admin-reject-text`, {
      id: hash(10002345),
      adminLink: link(`admin`, tgIdLink(1232155)),
    })
  })
}
