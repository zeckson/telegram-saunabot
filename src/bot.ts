import { API_CONSTANTS, Bot } from './deps.ts'
import { registerHandlers } from './handler/index.ts'
import { registerMiddleware } from './middleware/index.ts'
import { BotContext } from './type/context.ts'
import { Config } from './util/config.ts'

// Create bot object
const bot = new Bot<BotContext>(Config.TELEGRAM_TOKEN)

registerMiddleware(bot)
registerHandlers(bot)

bot.on(`my_chat_member`, async (ctx) => {
	const chat = ctx.myChatMember.chat
	const status = ctx.myChatMember.new_chat_member.status
	if (status === 'left' || status === 'kicked') {
		await ctx.chatStore.delete(chat.id)
	} else {
		await ctx.chatStore.saveOrUpdate(chat)
	}
})

export { bot }
export const onAfterInit = () => {
	console.log(`Bot has been started: 
  https://t.me/${bot.botInfo.username}
  tg://resolve?domain=${bot.botInfo.username}&start=test`)
}

export const DEFAULT_CONFIG = {
	allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
}
