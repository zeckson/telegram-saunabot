import { BotContext } from '../type/context.ts'
import { Bot } from '../deps.ts'
import { register as registerChatJoinRequest } from './chat-join-request.ts'
import { register as registerCommands } from './commands.ts'

export const registerHandlers = (bot: Bot<BotContext>) => {
	registerChatJoinRequest(bot)
	registerCommands(bot)
}
