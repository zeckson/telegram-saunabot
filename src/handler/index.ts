import { Bot } from '../deps.ts'
import { isAdmin } from "../predicate/is-admin.ts"
import { BotContext } from '../type/context.ts'
import { chatJoinComposer, } from './chat-join-composer.ts'
import { adminCommandComposer } from './admin-commands-composer.ts'
import { userCommandsComposer } from './user-command-composer.ts'

export const registerHandlers = (bot: Bot<BotContext>) => {
  bot.filter(isAdmin, adminCommandComposer.middleware())

  bot.use(chatJoinComposer.middleware())
	bot.use(userCommandsComposer.middleware())
}
