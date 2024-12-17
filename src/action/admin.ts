import { ChatJoinRequest, InlineKeyboard } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { getChatLink } from '../util/link.ts'
import { hash, text, userLink } from '../util/markdown.ts'
import { int } from '../util/system.ts'
import { notifyAdmins } from './notify-admin.ts'

const enum JoinRequestAction {
  APPROVE = `approve`,
  DECLINE = `decline`,
}

const notifyAllAdmins = (ctx: BotContext, message: string, other?: object) =>
  notifyAdmins((id: number) =>
    ctx.api.sendMessage(id, message, { ...other, parse_mode: 'MarkdownV2' })
  )

export const notifyAdminsOnPhoneNumber = (ctx: BotContext, phone: string) => {
  const from = ctx.user

  const vars = {
    userLink: userLink(from.identity, from.id),
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

export const notifyAdminsOnJoinRequest = (
  ctx: BotContext & ChatJoinRequest,
) => {
  const chat = ctx.chat
  const from = ctx.user
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
    userLink: userLink(from.identity, from.id),
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
    }),
  ).catch((err) => console.error(`Failed to notify: `, err))
}

const handleJoinRequest = (
  ctx: BotContext,
  action: JoinRequestAction,
  chatId: number | string,
  userId: number,
  updateId: string
): void => {
  switch (action) {
    case JoinRequestAction.APPROVE:
      ctx.api.approveChatJoinRequest(chatId, userId)
        .then(notifyApproved(ctx, updateId)).catch(notifyErrored(ctx, updateId))
      break
    case JoinRequestAction.DECLINE:
      ctx.api.declineChatJoinRequest(chatId, userId)
        .then(notifyRejected(ctx, updateId)).catch(notifyErrored(ctx, updateId))
      break
    default:
      console.error(`Unknown action: ${action}`)
  }
}

export const declineUserJoinRequest = async (ctx: BotContext & ChatJoinRequest, reason: string) => {

}

export const handleJoinAction = (ctx: BotContext) => {
  const data = ctx.callbackQuery?.data ?? ``
  const [actionValue, chatId, userId, updateId] = data.split(`:`)
  const action = actionValue as JoinRequestAction

  handleJoinRequest(ctx, action, chatId, int(userId), updateId)

  switch (action) {
    case JoinRequestAction.APPROVE:
      return  ctx.t(`chat-join-request_added-to-group`)
    case JoinRequestAction.DECLINE:
      return  ctx.t(`chat-join-request_declined-to-group`)
    default:
      return ctx.t(`chat-join-request_unknown-command`)
  }
}
