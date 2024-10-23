import { ChatJoinRequest, InlineKeyboard } from '../deps.ts'
import { BotContext } from "../type/context.ts"
import { hash, text, userLink } from "../util/markdown.ts"
import { int } from "../util/system.ts"
import { getChatLink, getUserLink } from "../util/username.ts"
import { notifyAdmins } from "./notify-admin.ts"

const enum JoinRequestAction {
  APPROVE = `approve`,
  DECLINE = `decline`,
}

const notifyAllAdmins = (ctx: BotContext, message: string, other?: object) =>
  notifyAdmins((id: number) => ctx.api.sendMessage(id, message, {...other, parse_mode: "MarkdownV2"}))

export const notifyAdminsOnPhoneNumber = (ctx: BotContext, phone: string) => {
  const from = ctx.from!

  const vars = {
    userLink: getUserLink(from),
    phone,
    verifyLink: `[ссылке](https://t.me/lolsbotcatcherbot?start=${from.id})`,
  }

  // NB!: grammyjs breaks message inserting invalid chars inside interpolation "{ $variable }"
  // NB!: grammyjs automatically formats numbers which breaks links to ids
  const message = ctx.t(`chat-join-phone-contact_admin-text`, vars)

  return notifyAllAdmins(ctx, message, {
    link_preview_options: { is_disabled: true },
  })
}

export const notifyAdminsOnJoinRequest = (ctx: BotContext & ChatJoinRequest) => {
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

  const vars = {
    id: hash(updateId),
    userLink: getUserLink(from),
    chatLink: getChatLink(chat),
    verifyLink: `[ссылке](https://t.me/lolsbotcatcherbot?start=${from.id})`,
  }

  // NB!: grammyjs breaks message inserting invalid chars inside interpolation "{ $variable }"
  // NB!: grammyjs automatically formats numbers which breaks links to ids
  const message = ctx.t(`chat-join-request_admin-notify-text`, vars)

  return notifyAllAdmins(ctx, message, {
    link_preview_options: { is_disabled: true },
    reply_markup: new InlineKeyboard(keyboard),
  })
}

const notifyApproved = (ctx: BotContext, updateId: string) => () =>
  notifyAllAdmins(
    ctx,
    ctx.t(`chat-join-request_admin-approve-text`, {
      id: updateId,
      adminLink: userLink(`админ`, ctx.from!.id),
    }),
  )

const notifyRejected = (ctx: BotContext, updateId: string) => () =>
  notifyAllAdmins(
    ctx,
    ctx.t(`chat-join-request_admin-reject-text`, {
      id: updateId,
      adminLink: userLink(`админ`, ctx.from!.id),
    }),
  )

const notifyErrored = (ctx: BotContext, updateId: string) => (e: Error) => {
  console.error(`Got error: `, e)
  return notifyAllAdmins(
    ctx,
    ctx.t(`chat-join-request_admin-error-text`, {
      id: updateId,
      adminLink: userLink(`админ`, ctx.from!.id),
      errorText: text(e.message),
    })
  ).catch((err) => console.error(`Failed to notify: `, err))
}

export const handleJoinAction = (ctx: BotContext) => {
  const data = ctx.callbackQuery?.data ?? ``
  const [action, chatId, userId, updateId] = data.split(`:`)

  let result = ctx.t(`chat-join-request_unknown-command`)
  switch (action) {
    case JoinRequestAction.APPROVE:
      ctx.api.approveChatJoinRequest(chatId, int(userId))
        .then(notifyApproved(ctx, updateId)).catch(notifyErrored(ctx, updateId))
      result = ctx.t(`chat-join-request_added-to-group`)
      break
    case JoinRequestAction.DECLINE:
      ctx.api.declineChatJoinRequest(chatId, int(userId))
        .then(notifyRejected(ctx, updateId)).catch(notifyErrored(ctx, updateId))
      result = ctx.t(`chat-join-request_declined-to-group`)
      break
    default:
      console.error(`Unknown action: ${action}`)
  }
  return result
}

