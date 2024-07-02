import { notifyAdmins } from "../action/notify-admin.ts"
import { Bot, ChatJoinRequest, InlineKeyboard } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { escapeSpecial } from "../util/string.ts"
import { int } from '../util/system.ts'
import { getUserLink } from "../util/username.ts"

export const enum JoinRequestAction {
  APPROVE = `approve`,
  DECLINE = `decline`
}

export const notifyJoinRequest = (ctx: BotContext & ChatJoinRequest) => {
  const chat = ctx.chat
  const from = ctx.from
  const updateId = ctx.update.update_id

  const keyboard = [[
    InlineKeyboard.text(
      ctx.t(`chat-join-request_approve`),
      `${JoinRequestAction.APPROVE}:${chat.id}:${from.id}:${updateId}`,
    ),
    InlineKeyboard.text(
      ctx.t(`chat-join-request_decline`),
      `${JoinRequestAction.DECLINE}:${chat.id}:${from.id}:${updateId}`,
    ),
  ]]

  const title = chat.title ?? chat.type
  const safeChatTitle = escapeSpecial(title)
  const vars = {
    id: String(updateId),
    userLink: getUserLink(from),
    chatLink: chat.username
      ? `[${safeChatTitle}](tg://resolve?domain=${chat.username})`
      : safeChatTitle,
    verifyLink: `[ссылке](https://t.me/lolsbotcatcherbot?start=${from.id})`,
  }

  // NB!: grammyjs breaks message inserting invalid chars inside interpolation "{ $variable }"
  // NB!: grammyjs automatically formats numbers which breaks links to ids
  const message = ctx.t(`chat-join-request_admin-notify-text`, vars)

  return notifyAdmins((id: number) => ctx.api.sendMessage(
    id,
    message,
    {
      link_preview_options: { is_disabled: true },
      reply_markup: new InlineKeyboard(keyboard),
      parse_mode: `MarkdownV2`,
    }
  ));
}

const handleQuery = (ctx: BotContext) => {
  const data = ctx.callbackQuery?.data ?? ``
  const [action, chatId, userId, updateId] = data.split(`:`)

  let result = ctx.t(`chat-join-request_unknown-command`)
  switch (action) {
    case JoinRequestAction.APPROVE:
      ctx.api.approveChatJoinRequest(chatId, int(userId)).catch((e) =>
        console.error(`Approve failed: ${e}`)
      )
      result = ctx.t(`chat-join-request_added-to-group`)
      break
    case JoinRequestAction.DECLINE:
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
  bot.on(`chat_join_request`, notifyJoinRequest as (u: unknown) => unknown)

  // TODO: Prevent insecure access from unknown account
  bot.on(`callback_query:data`, async (ctx) => {
    const result = handleQuery(ctx)

    await ctx.answerCallbackQuery(result)

    await ctx.editMessageReplyMarkup({ reply_markup: undefined })
  })
}
