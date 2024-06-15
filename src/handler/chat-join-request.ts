import { ChatJoinRequest } from 'https://deno.land/x/grammy_types@v3.4.6/manage.ts'
import { Bot, InlineKeyboard } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { Config } from '../util/config.ts'
import { int } from '../util/system.ts'

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

  await ctx.api.sendMessage(
    Config.ADMIN_ID,
    ctx.t(`chat-join-request_admin-notify-text`, {
      chat: chat.title,
      verifyLink: `https://t.me/lolsbotcatcherbot?start=${from.id}`,
    }),
    {
      link_preview_options: { is_disabled: true },
      reply_markup: new InlineKeyboard(keyboard),
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

    await ctx.deleteMessage()
  })
}
