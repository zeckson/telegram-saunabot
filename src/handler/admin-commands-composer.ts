import { Composer } from 'grammy'
import { Messages } from '../action/admin.messages.ts'
import { declineUserJoinRequest, validateJoinRequest } from '../action/admin.ts'
import { getBanInfo } from '../action/ban.ts'
import { requestUserContact } from '../action/user.ts'
import { ChatJoinRequest } from '../deps.ts'
import { isAdminMiddleware } from "../predicate/is-admin.ts"
import { BotContext } from '../type/context.ts'
import { User } from '../type/user.type.ts'
import { handleChatJoinRequest } from "../usecase/join/handle-chat-join-request.ts"
import { link, text } from '../util/markdown.ts'
import { int } from '../util/system.ts'

const bot = new Composer<BotContext>(isAdminMiddleware)

const asJoinRequest = (
	ctx: BotContext,
	withUser?: User,
): BotContext & ChatJoinRequest => {
	return Object.assign(ctx, {
		user: withUser ?? ctx.user,
	}) as BotContext & ChatJoinRequest
}

const getUser = (ctx: BotContext): User | undefined => {
	const params = ctx.message?.text?.split(' ').slice(1)
	const param_user_id = params?.[0] ? int(params[0]) : undefined
	return param_user_id
		? { id: param_user_id, identity: `Пользователь` } as User
		: undefined
}

bot.command(`join`, (ctx: BotContext) => {
	return handleChatJoinRequest(asJoinRequest(ctx, getUser(ctx)))})

bot.command('md2', (ctx) => {
	// `item` will be "apple pie" if a user sends "/md2 apple pie".
	const item = ctx.match
	return ctx.reply(text(item), { parse_mode: `MarkdownV2` })
})

bot.command('md2link', (ctx) => {
	// `item` will be "apple pie" if a user sends "/md2 apple pie".
	const [name, url] = ctx.match.split(` `)
	return ctx.reply(link(name, url), { parse_mode: `MarkdownV2` })
})

bot.command(
	`notify`,
	(ctx: BotContext) =>
		validateJoinRequest(
			Object.assign(ctx, {
				bio: '',
				date: 0,
				invite_link: undefined,
				user_chat_id: ctx.chat!.id,
			}) as BotContext & ChatJoinRequest,
		),
)

bot.command(
	`phone`,
	(ctx: BotContext) =>
		requestUserContact(
			Object.assign(ctx, {
				bio: '',
				date: 0,
				invite_link: undefined,
				user_chat_id: ctx.chat!.id,
			}) as BotContext & ChatJoinRequest,
		),
)

bot.command('demo', async (ctx) => {
	await ctx.replyFmt(Messages.notifyJoinApproved(ctx, 100))
})

bot.command('status', async (ctx) => {
	await ctx.replyFmt(
		Messages.onJoinRequest(
			asJoinRequest(ctx, getUser(ctx)),
			await getBanInfo(ctx.user.id),
		),
	)
})

bot.command('reject', async (ctx: BotContext) => {
	const context = asJoinRequest(ctx, getUser(ctx)) as
		& BotContext
		& ChatJoinRequest
	await declineUserJoinRequest(
		context,
		Messages.onJoinRequest(context, await getBanInfo(ctx.user.id)),
	)
})

bot.command('error', async (ctx: BotContext) => {
	await ctx.api.sendMessage(12345, `text`)
})

export const adminCommandComposer = bot
