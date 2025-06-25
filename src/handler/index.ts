import { Bot } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { isAdminMiddleware } from '../util/is-admin.ts'
import { adminCommandComposer } from "./admin-commands-composer.ts"
import { register as registerChatJoinRequest } from './chat-join-request.ts'
import { userCommandsComposer } from "./user-command-composer.ts"

export const registerHandlers = (bot: Bot<BotContext>) => {
	registerChatJoinRequest(bot)

  bot.use(userCommandsComposer.middleware())
	bot.use(isAdminMiddleware).use(adminCommandComposer.middleware())
}
