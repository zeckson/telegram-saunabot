import { CommandContext, Composer } from 'grammy'
import { ChatJoinRequest, fmt } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { JoinRequestAction } from '../type/join-request.ts'
import { User } from '../type/user.type.ts'
import {
	CallbackContextFlow,
	JoinRequestData,
} from '../usecase/callback/callback-context.type.ts'
import {
	approveJoinRequestPipeline,
	declineJoinRequestPipeline,
} from '../usecase/callback/handle-callback-query.ts'
import { handleChatJoinRequest } from '../usecase/join/handle-chat-join-request.ts'
import { pipeline } from '../usecase/pipeline.ts'
import { int } from '../util/system.ts'

const bot = new Composer<BotContext>()

const asJoinRequest = (
	ctx: BotContext,
	withUser?: User,
): BotContext & ChatJoinRequest => {
	return Object.assign(ctx, {
		user: withUser ?? ctx.user,
	}) as BotContext & ChatJoinRequest
}

const withData = (
	ctx: BotContext,
	data: JoinRequestData,
): CallbackContextFlow => Object.assign(ctx, { data }) as CallbackContextFlow

const command2action = {
	'join': {
		description: 'Process join request',
		action: (ctx: CommandContext<BotContext>) => {
			// ctx.match contains everything after "/join "
			const paramUserId = ctx.match ? int(ctx.match) : undefined

			const user = paramUserId
				? { id: paramUserId, identity: 'User', fullName: 'Fake Name' } as User
				: ctx.user
			return handleChatJoinRequest(asJoinRequest(ctx, user))
		},
	},
	'approve': {
		description: 'Approve join request',
		action: (ctx: BotContext) =>
			pipeline(`approve`, approveJoinRequestPipeline, true)(
				withData(ctx, {
					action: JoinRequestAction.APPROVE,
					userId: ctx.user.id,
					chatId: ctx.chat?.id ?? ctx.user.id,
				}),
			),
	},
	'reject': {
		description: 'Decline join request',
		action: (ctx: BotContext) =>
			pipeline(`decline`, declineJoinRequestPipeline, true)(
				withData(ctx, {
					action: JoinRequestAction.DECLINE,
					userId: ctx.user.id,
					chatId: ctx.chat?.id ?? ctx.user.id,
				}),
			),
	},
	'error': {
		description: 'Test error handling',
		action: async (ctx: BotContext) => {
			await ctx.api.sendMessage(12345, `text`)
		},
	},
}
const AVAILABLE_COMMANDS: string[] = []

for (const [command, descriptor] of Object.entries(command2action)) {
	bot.command(command, descriptor.action)
	AVAILABLE_COMMANDS.push(`/${command} - ${descriptor.description}`)
}

bot.on(`message`, (ctx) => {
	const commands = AVAILABLE_COMMANDS.map((cmd) => `• ${cmd}`).join('\n')
	return ctx.replyFmt(fmt`Available commands:\n${commands}`)
})

export const adminCommandComposer = bot
