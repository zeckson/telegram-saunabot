import { Keyboard, User } from '../deps.ts'
import { BotContext } from "../type/context.ts"

export const requestUserContact = (
  ctx: BotContext,
  from: User,
  chat: { name: string; link: string },
) => {
  const message = ctx.t(`chat-join-verify-message`, {
    chatLink: `[${chat.name}](${chat.link})`,
  })
  return ctx.api.sendMessage(from.id, message, {
    reply_markup: { keyboard: [[Keyboard.requestContact(`Phone contact`)]] },
  })
}
