import { CallbackQuery } from 'grammy/types'
import { BotContext } from "../../type/context.ts"

export type CallbackContextFlow = BotContext & {
  callbackQuery: Required<CallbackQuery>
};
