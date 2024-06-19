import { ChatJoinRequest } from 'https://deno.land/x/grammy_types@v3.4.6/manage.ts'
import { Bot, InlineKeyboard } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { Config } from '../util/config.ts'
import { int } from '../util/system.ts'
import { getFullName } from "../util/username.ts"

const escapeSpecial = (value: string): string => {
  const result = []
  for (const it of value) {
    switch (it) {
      case `#`:
        result.push(`\\`)
      // fall through
      default:
        result.push(it)
    }
  }
  return result.join(``)
}

const APPROVE_ACTION = `approve`
const DECLINE_ACTION = `reject`
const handleChatJoinRequest = async (ctx: BotContext & ChatJoinRequest) => {
  const chat = ctx.chat
  const from = ctx.from

  const keyboard = [[
    InlineKeyboard.text(
      ctx.t(`chat-join-request_approve`),
      `${APPROVE_ACTION}:${chat.id}:${from.id}`,
    ),
    InlineKeyboard.text(
      ctx.t(`chat-join-request_decline`),
      `${DECLINE_ACTION}:${chat.id}:${from.id}`,
    ),
  ]]

  const vars = {
    userLink: `[${getFullName(from)}](tg://user?id=${from.id})`,
    chatLink: `[${escapeSpecial(chat.title)}](tg://resolve?domain=${chat.username})`,
    verifyLink: `[ссылке](https://t.me/lolsbotcatcherbot?start=${from.id})`,
  }

  // NB!: grammyjs breaks message inserting invalid chars inside interpolation "{ $variable }"
  // NB!: grammyjs automatically formats numbers which breaks links to ids
  const message = ctx.t(`chat-join-request_admin-notify-text`, vars)

  await ctx.api.sendMessage(
    Config.ADMIN_ID,
    message,
    {
      link_preview_options: { is_disabled: true },
      reply_markup: new InlineKeyboard(keyboard),
      parse_mode: `MarkdownV2`
    },
  )
}
const handleQuery = (ctx: BotContext) => {
  const data = ctx.callbackQuery?.data ?? ``
  const [action, chatId, userId] = data.split(`:`)

  let result = ctx.t(`chat-join-request_unknown-command`)
  switch (action) {
    case APPROVE_ACTION:
      ctx.api.approveChatJoinRequest(chatId, int(userId)).catch((e) =>
        console.error(`Approve failed: ${e}`)
      )
      result = ctx.t(`chat-join-request_added-to-group`)
      break
    case DECLINE_ACTION:
      ctx.api.declineChatJoinRequest(chatId, int(userId)).catch((e) =>
        console.error(`Decline failed: ${e}`)
      )
      result = ctx.t(`chat-join-request_declined-to-group`)
      break
    default:
      console.error(`Unknown action: ${action}`)
  }
  return result
}

export const register = (bot: Bot<BotContext>) => {
  // noinspection TypeScriptValidateTypes
  bot.on(`chat_join_request`, handleChatJoinRequest as (u: unknown) => unknown)

  // TODO: Prevent insecure access from unknown account
  bot.on(`callback_query:data`, async (ctx) => {
    const result = handleQuery(ctx)

    await ctx.answerCallbackQuery(result)

    await ctx.editMessageReplyMarkup({reply_markup: undefined})
  })
}


