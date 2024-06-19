import { JoinRequestAction, notifyJoinRequest } from "../action/notify-admin.ts"
import { Bot } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { int } from '../util/system.ts'

const APPROVE_ACTION = JoinRequestAction.APPROVE
const DECLINE_ACTION = JoinRequestAction.DECLINE

const handleQuery = (ctx: BotContext) => {
  const data = ctx.callbackQuery?.data ?? ``
  const [action, chatId, userId] = data.split(`:`)

  let result = ctx.t(`chat-join-request_unknown-command`)
  switch (action) {
    case APPROVE_ACTION:
      ctx.api.approveChatJoinRequest(chatId, int(userId)).catch((e) =>
        console.error(`Approve failed: ${e}`)
      )
      result = ctx.t(`chat-join-request_added-to-group`)
      break
    case DECLINE_ACTION:
      ctx.api.declineChatJoinRequest(chatId, int(userId)).catch((e) =>
        console.error(`Decline failed: ${e}`)
      )
      result = ctx.t(`chat-join-request_declined-to-group`)
      break
    default:
      console.error(`Unknown action: ${action}`)
  }
  return result
}

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
