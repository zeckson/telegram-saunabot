import {
  handleJoinAction,
  notifyAdminsOnJoinRequest,
  notifyAdminsOnPhoneNumber,
} from '../action/admin.ts'
import { checkUserIsBanned } from "../action/ban.ts"
import { requestUserContact, userContactResponse } from '../action/user.ts'
import { Bot, ChatJoinRequest } from '../deps.ts'
import { BotContext } from '../type/context.ts'

const onJoinRequest = async (ctx: BotContext & ChatJoinRequest) => {
  try {
    await requestUserContact(ctx)
  } catch (e) {
    // TODO: make different message on success request and not
    console.error(e)
  }

  const banned = await checkUserIsBanned(ctx)
  if (banned) {
    return
  }

  return notifyAdminsOnJoinRequest(ctx)
}

const onPhoneNumber = (ctx: BotContext) => {
  const phone = userContactResponse(ctx)

  if (phone) {
    return notifyAdminsOnPhoneNumber(ctx, phone)
  }
}

export const register = (bot: Bot<BotContext>) => {
  // noinspection TypeScriptValidateTypes
  bot.on(`chat_join_request`, onJoinRequest as (u: unknown) => unknown)
  bot.on(`message:contact`, onPhoneNumber)

  // TODO: Prevent insecure access from unknown account
  bot.on(`callback_query:data`, async (ctx) => {
    const result = handleJoinAction(ctx)

    await ctx.answerCallbackQuery(result)

    await ctx.editMessageReplyMarkup({ reply_markup: undefined })
  })
}
