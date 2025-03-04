import { Bot, hydrateReply } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { log } from './log.ts'
import { error } from './error.ts'
import { context } from './context.ts'

export const registerMiddleware = (bot: Bot<BotContext>) => {
	// Install user-context
	bot.use(context)

	// Save errors
	bot.use(error)

	// Install logger
	bot.use(log)

	// Install format reply variant to ctx
	bot.use(hydrateReply)
}
