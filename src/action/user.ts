import { ChatJoinRequest, Keyboard } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { Messages } from './user.messages.ts'

export const requestUserContact = (
  ctx: BotContext & ChatJoinRequest,
) => {
  // BC! Avoid using context -- it's not sage
  const message = Messages.chatJoinVerifyMessage(ctx)
  return ctx.replyFmt(message, {
    link_preview_options: { is_disabled: true },
    reply_markup: {
      keyboard: [[
        Keyboard.requestContact(Messages.shareContactButtonName),
      ]],
      is_persistent: true,
    },
  })
}

export const userContactResponse = async (ctx: BotContext) => {
  const contact = ctx.message?.contact
  if (!contact) {
    await ctx.replyFmt('Пришлите пожалуйста контактные данные')
    return undefined
  }

  const message =
    'Благодарим! Наши админы проверят информацию и добавят вас в группу!'
  await ctx.replyFmt(message, {
    reply_markup: {
      remove_keyboard: true, // Removes the reply keyboard
    },
  })
  return contact.phone_number
}
