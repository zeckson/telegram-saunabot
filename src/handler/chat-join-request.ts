import {
  handleJoinAction,
  notifyAdminsOnJoinRequest,
} from "../action/admin.ts"
import { Bot } from '../deps.ts'
import { BotContext } from '../type/context.ts'

export const notifyJoinRequest = notifyAdminsOnJoinRequest

const handleQuery = handleJoinAction

export const register = (bot: Bot<BotContext>) => {
  // noinspection TypeScriptValidateTypes
  bot.on(`chat_join_request`, notifyJoinRequest as (u: unknown) => unknown)

  // TODO: Prevent insecure access from unknown account
  bot.on(`callback_query:data`, async (ctx) => {
    const result = handleQuery(ctx)

    await ctx.answerCallbackQuery(result)

    await ctx.editMessageReplyMarkup({ reply_markup: undefined })
  })
}
