import { notifyAdmins } from "../action/notify-admin.ts"
import { Bot, ChatJoinRequest, InlineKeyboard } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { escapeSpecial, link, tgIdLink } from "../util/string.ts"
import { int } from '../util/system.ts'
import { getUserLink } from "../util/username.ts"

export const enum JoinRequestAction {
  APPROVE = `approve`,
  DECLINE = `decline`,
}

const notifyAll = (ctx: BotContext, message: string, other?: object) =>
  notifyAdmins((id: number) => ctx.api.sendMessage(id, message, {...other, parse_mode: "MarkdownV2"}))

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

  return notifyAll(ctx, message, {
    link_preview_options: { is_disabled: true },
    reply_markup: new InlineKeyboard(keyboard),
  })
}

const approved = (ctx: BotContext, updateId: string) => () =>
  notifyAll(
    ctx,
    ctx.t(`chat-join-request_admin-approve-text`, {
      id: updateId,
      adminLink: link(`админ`, tgIdLink(ctx.from!.id)),
    }),
  )

const rejected = (ctx: BotContext, updateId: string) => () =>
  notifyAll(
    ctx,
    ctx.t(`chat-join-request_admin-reject-text`, {
      id: updateId,
      adminLink: link(`админ`, tgIdLink(ctx.from!.id)),
    }),
  )

const errored = (ctx: BotContext, updateId: string) => (e: Error) => {
  console.error(`Got error: `, e)
  return notifyAll(
    ctx,
    ctx.t(`chat-join-request_admin-error-text`, {
      id: updateId,
      adminLink: link(`админ`, tgIdLink(ctx.from!.id)),
      errorText: escapeSpecial(e.message),
    })
  ).catch((err) => console.error(`Failed to notify: `, err))
}

const handleQuery = (ctx: BotContext) => {
  const data = ctx.callbackQuery?.data ?? ``
  const [action, chatId, userId, updateId] = data.split(`:`)

  let result = ctx.t(`chat-join-request_unknown-command`)
  switch (action) {
    case JoinRequestAction.APPROVE:
      ctx.api.approveChatJoinRequest(chatId, int(userId))
        .then(approved(ctx, updateId)).catch(errored(ctx, updateId))
      result = ctx.t(`chat-join-request_added-to-group`)
      break
    case JoinRequestAction.DECLINE:
      ctx.api.declineChatJoinRequest(chatId, int(userId))
        .then(rejected(ctx, updateId)).catch(errored(ctx, updateId))
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
