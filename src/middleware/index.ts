import { Bot } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { log } from "./log.ts"
import { registerTranslate } from "./translate.ts"

export const registerMiddleware = async (bot: Bot<BotContext>) => {
  bot.use(log)
  await registerTranslate(bot)
}
