import { Composer } from 'grammy'
import { BotContext } from '../type/context.ts'

const bot = new Composer<BotContext>()

bot.command(`start`, (ctx: BotContext) => {
	return ctx.replyFmt(`Привет, ${ctx.user.identity}!`)
})

export const userCommandsComposer = bot
