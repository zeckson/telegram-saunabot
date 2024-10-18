import {
  handleJoinAction,
  notifyAdminsOnJoinRequest,
} from "../action/admin.ts"
import { requestUserContact } from "../action/user.ts"
import { Bot, ChatJoinRequest } from '../deps.ts'
import { BotContext } from '../type/context.ts'

const onJoinRequest = async (ctx: BotContext & ChatJoinRequest) => {
  try {
    await requestUserContact(ctx)
  } catch (e) {
    // TODO: make different message on success request and not
    console.error(e)
  }

  return notifyAdminsOnJoinRequest(ctx)
}

export const register = (bot: Bot<BotContext>) => {
  // noinspection TypeScriptValidateTypes
  bot.on(`chat_join_request`, onJoinRequest as (u: unknown) => unknown)

  // TODO: Prevent insecure access from unknown account
  bot.on(`callback_query:data`, async (ctx) => {
    const result = handleJoinAction(ctx)

    await ctx.answerCallbackQuery(result)

    await ctx.editMessageReplyMarkup({ reply_markup: undefined })
  })
}
