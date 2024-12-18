import { Chat, ChatJoinRequest, Keyboard } from '../deps.ts'
import { BotContext } from "../type/context.ts"
import { getChatLink } from "../util/link.ts"
import { text } from "../util/markdown.ts"

export const requestUserContact = (
  ctx: BotContext & ChatJoinRequest,
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
    reply_markup: {
      keyboard: [[
        Keyboard.requestContact(ctx.t(`chat-join-phone-contact`))]],
    },
  })
}

export const userContactResponse = async (ctx: BotContext) => {
  const contact = ctx.message?.contact
  if (!contact) {
    await ctx.replyFmt("Пришлите пожалуйста контактные данные")
    return undefined
  }

  const message = "Благодарим! Наши админы проверят информацию и добавят вас в группу!"
  await ctx.replyFmt(message, {
    reply_markup: {
      remove_keyboard: true, // Removes the reply keyboard
    },
  })
  return contact.phone_number
}
