import { ChatJoinRequest, FormattedString, InlineKeyboard } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { text, userLink } from '../util/markdown.ts'
import { int } from '../util/system.ts'
import { Messages } from './admin.messages.ts'
import { getBanInfo } from './ban.ts'
import { notifyAdmins } from './notify-admin.ts'

const enum JoinRequestAction {
  APPROVE = `approve`,
  DECLINE = `decline`,
}

const notifyAllAdmins = (
  ctx: BotContext,
  message: string | FormattedString,
  other?: object,
) => {
  let params: object = {}
  if (message instanceof FormattedString) {
    params = { entities: message.entities, ...other }
    message = message.toString()
  } else {
    params = { parse_mode: 'MarkdownV2', ...other }
  }
  return notifyAdmins((id: number) =>
    ctx.api.sendMessage(id, message as string, params)
  )
}

export const notifyAdminsOnPhoneNumber = (ctx: BotContext, phone: string) => {
  const message = Messages.chatJoinContactReceivedAdminNotification(ctx, phone)

  return notifyAllAdmins(ctx, message, {
    link_preview_options: { is_disabled: true },
  })
}

export const notifyAdminsOnJoinRequest = async (
  ctx: BotContext & ChatJoinRequest,
) => {
  const chat = ctx.chat
  const from = ctx.user
  const updateId = ctx.update.update_id

  const keyboard = new InlineKeyboard()

  const info = await getBanInfo(ctx.user.id)
  if (info.length > 0) {
    handleJoinRequest(
      ctx,
      JoinRequestAction.DECLINE,
      ctx.chat.id,
      ctx.user.id,
      String(ctx.update.update_id),
    )
  } else {
    keyboard.add(InlineKeyboard.text(
      ctx.t(`chat-join-request_approve`),
      `${JoinRequestAction.APPROVE}:${chat.id}:${from.id}:${updateId}`,
    ))
    keyboard.add(InlineKeyboard.text(
      ctx.t(`chat-join-request_decline`),
      `${JoinRequestAction.DECLINE}:${chat.id}:${from.id}:${updateId}`,
    ))
  }

  return notifyAllAdmins(ctx, Messages.onJoinRequest(ctx, info), {
    link_preview_options: { is_disabled: true },
    reply_markup: keyboard,
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
  updateId: string,
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

export const declineUserJoinRequest = (
  ctx: BotContext & ChatJoinRequest,
  text: FormattedString,
) => {
  handleJoinRequest(
    ctx,
    JoinRequestAction.DECLINE,
    ctx.chat.id,
    ctx.user.id,
    String(ctx.update.update_id),
  )

  return notifyAllAdmins(ctx, text, {
    link_preview_options: { is_disabled: true },
    disable_notification: true,
    entities: text.entities,
  })
}

export const handleJoinAction = (ctx: BotContext): string => {
  const data = ctx.callbackQuery?.data ?? ``
  const [actionValue, chatId, userId, updateId] = data.split(`:`)
  const action = actionValue as JoinRequestAction

  handleJoinRequest(ctx, action, chatId, int(userId), updateId)

  switch (action) {
    case JoinRequestAction.APPROVE:
      return ctx.t(`chat-join-request_added-to-group`)
    case JoinRequestAction.DECLINE:
      return ctx.t(`chat-join-request_declined-to-group`)
    default:
      return ctx.t(`chat-join-request_unknown-command`)
  }
}
