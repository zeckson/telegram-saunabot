import { Chat, ChatJoinRequest, Keyboard, User } from '../deps.ts'
import { BotContext } from "../type/context.ts"
import { getChatLink } from "../util/username.ts"

export const requestUserContact = (
  ctx: BotContext & ChatJoinRequest
) => {
  const from: User = ctx.from
  const chat: Chat = ctx.chat

  const message = ctx.t(`chat-join-verify-message`, {
    chatLink: getChatLink(chat),
  })
  return ctx.api.sendMessage(from.id, message, {
    reply_markup: { keyboard: [[Keyboard.requestContact(ctx.t(`chat-join-phone-contact`))]] },
  })
}
