import { notifyAdminsOnJoinRequest } from "../action/admin.ts"
import { requestUserContact } from "../action/user.ts"
import { Bot, ChatJoinRequest } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { emojis } from "../util/emoji.ts"
import { chatLink, hash, link, text, userLink } from "../util/markdown.ts"

export const register = (bot: Bot<BotContext>) => {
  bot.command(`start`, (ctx: BotContext) => {
    return ctx.reply(ctx.t(`commands_greeting-test`, {fullName: ctx.user.fullName}))
  })

  bot.command(`test`, (ctx: BotContext) => {
    // Check broken parse_mode with fluent context
    const from = ctx.from!
    const chat = ctx.chat!

    const safeChatTitle = text(chat.title || chat.type)
    return ctx.reply(
      ctx.t(`chat-join-request_admin-notify-text`, {
        id: hash(ctx.update.update_id),
        userLink: userLink(ctx.user.identity, from.id),
        chatLink: chat.username
          ? chatLink(safeChatTitle, chat.username)
          : safeChatTitle,
        verifyLink: link(
          `ссылке`,
          `https://t.me/lolsbotcatcherbot?start=${from.id}`,
        ),
      }),
      {
        link_preview_options: { is_disabled: true },
        parse_mode: `MarkdownV2`,
      },
    )
  })

  bot.command('md2', (ctx) => {
    // `item` will be "apple pie" if a user sends "/md2 apple pie".
    const item = ctx.match
    return ctx.reply(text(item), { parse_mode: `MarkdownV2` })
  })

  bot.command('md2link', (ctx) => {
    // `item` will be "apple pie" if a user sends "/md2 apple pie".
    const [name, url] = ctx.match.split(` `)
    return ctx.reply(link(name, url), { parse_mode: `MarkdownV2` })
  })

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
    await ctx.replyT(`chat-join-request_admin-approve-text`, {
      id: hash(10002345),
      adminLink: userLink(`admin`, 1232155),
    })
    await ctx.reply(`*This* is _the_ default \`formatting\` ${emojis.robot}`, {
      parse_mode: 'MarkdownV2',
    })
  })
}
