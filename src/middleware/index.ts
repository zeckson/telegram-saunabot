import { Bot, hydrateReply } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { log } from './log.ts'
import { context } from './context.ts'
import { registerTranslate } from './translate.ts'

export const registerMiddleware = async (bot: Bot<BotContext>) => {
  // Install user-context
  bot.use(context)

  // Install logger
  bot.use(log)

  // Install format reply variant to ctx
  bot.use(hydrateReply)

  // Set translation
  await registerTranslate(bot)
}
