import { ChatJoinRequest, InlineKeyboard } from '../deps.ts'
import { BotContext } from "../type/context.ts"
import { Config } from "../util/config.ts"
import { escapeSpecial } from "../util/string.ts"
import { getFullName } from "../util/username.ts"

export const enum JoinRequestAction {
  APPROVE = `approve`,
  DECLINE = `decline`
}

export const notifyJoinRequest = (ctx: BotContext & ChatJoinRequest) => {
  const chat = ctx.chat
  const from = ctx.from

  const keyboard = [[
    InlineKeyboard.text(
      ctx.t(`chat-join-request_approve`),
      `${JoinRequestAction.APPROVE}:${chat.id}:${from.id}`,
    ),
    InlineKeyboard.text(
      ctx.t(`chat-join-request_decline`),
      `${JoinRequestAction.DECLINE}:${chat.id}:${from.id}`,
    ),
  ]]

  const title = chat.title ?? chat.type
  const safeChatTitle = escapeSpecial(title)
  const vars = {
    userLink: `[${getFullName(from)}](tg://user?id=${from.id})`,
    chatLink: chat.username
      ? `[${safeChatTitle}](tg://resolve?domain=${chat.username})`
      : safeChatTitle,
    verifyLink: `[ссылке](https://t.me/lolsbotcatcherbot?start=${from.id})`,
  }

  // NB!: grammyjs breaks message inserting invalid chars inside interpolation "{ $variable }"
  // NB!: grammyjs automatically formats numbers which breaks links to ids
  const message = ctx.t(`chat-join-request_admin-notify-text`, vars)

  const responses = []

  const send = (id: number) => ctx.api.sendMessage(
    id,
    message,
    {
      link_preview_options: { is_disabled: true },
      reply_markup: new InlineKeyboard(keyboard),
      parse_mode: `MarkdownV2`,
    }
  )

  for (const id of Config.ADMIN_IDS) {
    responses.push(send(id))
  }

  return Promise.all(responses)
}

