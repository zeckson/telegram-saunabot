import { NextFunction } from "grammy"
import { Messages } from '../action/admin.messages.ts'
import {
  handleJoinAction,
  validateJoinRequest,
  notifyAdminsOnPhoneNumber,
  notifyAllAdmins,
} from '../action/admin.ts'
import { requestUserContact, userContactResponse } from '../action/user.ts'
import { Bot, ChatJoinRequest, GrammyError } from '../deps.ts'
import { UserStore } from "../store/user-store.ts"
import { BotContext } from '../type/context.ts'

const sendUserContactRequest = async (ctx: BotContext & ChatJoinRequest) => {
  try {
    await requestUserContact(ctx)
  } catch (e: unknown) {
    // TODO: make different message on success request and not
    console.error(e)
    try {
      await notifyAllAdmins(
        ctx,
        Messages.requestContactError(ctx, e as GrammyError),
      )
    } catch (e: unknown) {
      console.error(e)
    }
  }
}

const onJoinRequest = async (ctx: BotContext & ChatJoinRequest, next: NextFunction) => {
  const banned = await validateJoinRequest(ctx)

  if (!banned) { await next() }
}

const onPhoneNumber = async (ctx: BotContext) => {
	const phone = await userContactResponse(ctx)

	if (phone) {
    const userStore = new UserStore(ctx.store)
    await userStore.savePhone(ctx.user.id, phone)
    return notifyAdminsOnPhoneNumber(ctx, phone)
	}
}

export const register = (bot: Bot<BotContext>) => {
	// noinspection TypeScriptValidateTypes
	bot.on(`chat_join_request`, onJoinRequest as (u: unknown) => unknown)
	bot.on(`chat_join_request`, sendUserContactRequest as (u: unknown) => unknown)
	bot.on(`message:contact`, onPhoneNumber)

	// TODO: Prevent insecure access from unknown account
	bot.on(`callback_query:data`, async (ctx) => {
		const result = handleJoinAction(ctx)

		await ctx.answerCallbackQuery(result)

		await ctx.editMessageReplyMarkup({ reply_markup: undefined })
	})
}
