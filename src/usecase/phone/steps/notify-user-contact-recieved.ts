import type { PhoneFlowContext } from "../phone-context.ts"

export const notifyUserContactRecieved = async (context: PhoneFlowContext) => {
  const message =
    'Благодарим! Наши админы проверят информацию и добавят вас в группу!'
  await context.replyFmt(message, {
    reply_markup: {
      remove_keyboard: true, // Removes the reply keyboard
    },
  })
  return { ok: true }

}
