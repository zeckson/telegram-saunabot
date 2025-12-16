import type { PhoneFlowContext } from "../phone-context.ts"

export const notifyUserNoContact = async (context: PhoneFlowContext) => {
  await context.replyFmt('Я передал ваши сообщения админу, ' +
    'но чтобы быстрее попасть в группу, ' +
    'пришлите пожалуйста контактные данные, ' +
    'выбрав кнопку снизу')
  return { ok: true }

}
