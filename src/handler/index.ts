import { Bot } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { isAdminMiddleware } from '../util/is-admin.ts'
import { register as registerChatJoinRequest } from './chat-join-request.ts'
import { commandComposer } from './commands.ts'

export const registerHandlers = (bot: Bot<BotContext>) => {
	registerChatJoinRequest(bot)

	bot.use(isAdminMiddleware).use(commandComposer.middleware())
}
