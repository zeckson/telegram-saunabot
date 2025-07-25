import { Composer, NextFunction } from 'grammy'
import { Messages } from '../action/admin.messages.ts'
import { handleJoinAction, notifyAdminsOnPhoneNumber, notifyAllAdmins, validateJoinRequest, } from '../action/admin.ts'
import { requestUserContact, userContactResponse } from '../action/user.ts'
import { ChatJoinRequest, GrammyError } from '../deps.ts'
import { isAdminMiddleware } from "../predicate/is-admin.ts"
import { UserStore } from '../store/user-store.ts'
import { BotContext } from '../type/context.ts'

const sendUserContactRequest = async (ctx: BotContext & ChatJoinRequest) => {
	try {
		await requestUserContact(ctx)
	} catch (e: unknown) {
		await notifyAllAdmins(
			ctx,
			Messages.requestContactError(ctx, e as GrammyError),
		)
	}
}

const onJoinRequest = async (
	ctx: BotContext & ChatJoinRequest,
	next: NextFunction,
) => {
	const banned = await validateJoinRequest(ctx)

	if (!banned) await next()
}

const onPhoneNumber = async (ctx: BotContext) => {
	const phone = await userContactResponse(ctx)

	if (phone) {
		const userStore = new UserStore(ctx.store)
		await userStore.savePhone(ctx.user.id, phone)
		return notifyAdminsOnPhoneNumber(ctx, phone)
	}
}

const bot = new Composer<BotContext>()

// noinspection TypeScriptValidateTypes
bot.on(`chat_join_request`, onJoinRequest as (u: unknown) => unknown)
bot.on(
	`chat_join_request`,
	sendUserContactRequest as (u: unknown) => unknown,
)
bot.on(`message:contact`, onPhoneNumber)

bot.on(`callback_query:data`, isAdminMiddleware, async (ctx) => {
	const result = await handleJoinAction(ctx)

	await ctx.answerCallbackQuery(result)

	await ctx.editMessageReplyMarkup({ reply_markup: undefined })
})

export const chatJoinComposer = bot
