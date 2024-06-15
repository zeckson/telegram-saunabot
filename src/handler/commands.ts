import { BotContext } from "../type/context.ts"
import { Bot } from "../deps.ts"

export const register = (bot: Bot<BotContext>) => {
  bot.command(`start`, (ctx: BotContext) => {
    return ctx.reply(ctx.t(`greeting`))
  })
}
