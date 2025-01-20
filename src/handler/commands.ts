import { Messages } from '../action/admin.messages.ts'
import {
	declineUserJoinRequest,
	notifyAdminsOnJoinRequest,
} from '../action/admin.ts'
import { getBanInfo } from '../action/ban.ts'
import { requestUserContact } from '../action/user.ts'
import { Bot, ChatJoinRequest } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { User } from '../type/user.type.ts'
import { emojis } from '../util/emoji.ts'
import { link, text } from '../util/markdown.ts'
import { int } from '../util/system.ts'

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
export const register = (bot: Bot<BotContext>) => {
	bot.command(`start`, (ctx: BotContext) => {
		return ctx.replyFmt(`Привет, ${ctx.user.identity}!`)
	})

	bot.command(`test`, (ctx: BotContext) => {
		return ctx.replyFmt(
			Messages.onJoinRequest(asJoinRequest(ctx), undefined),
			{
				link_preview_options: { is_disabled: true },
			},
		)
	})

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
			notifyAdminsOnJoinRequest(
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
		await ctx.replyFmt(Messages.notifyJoinApproved(ctx, `100`))
		await ctx.reply(
			`*This* is _the_ default \`formatting\` ${emojis.robot}`,
			{
				parse_mode: 'MarkdownV2',
			},
		)
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
}
