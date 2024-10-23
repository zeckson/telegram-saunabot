import { Chat, ChatJoinRequest, Keyboard, User } from '../deps.ts'
import { BotContext } from "../type/context.ts"
import { text } from "../util/markdown.ts"
import { getChatLink } from "../util/link.ts"

export const requestUserContact = (
  ctx: BotContext & ChatJoinRequest
) => {
  const from = ctx.user
  const chat: Chat = ctx.chat

  // BC! Avoid using context -- it's not sage
  const message = ctx.t(`chat-join-verify-message`, {
    fullName: text(from.fullName),
    chatLink: getChatLink(chat),
  })
  return ctx.api.sendMessage(from.id, message, {
    parse_mode: `MarkdownV2`,
    reply_markup: { keyboard: [[Keyboard.requestContact(ctx.t(`chat-join-phone-contact`))]] },
  })
}

export const userContactResponse = (ctx: BotContext) => {
  const contact = ctx.message?.contact
  if (!contact) return undefined

  return contact.phone_number
}
