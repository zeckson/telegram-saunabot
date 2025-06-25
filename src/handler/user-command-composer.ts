import { Composer } from 'grammy'
import { Messages } from '../action/admin.messages.ts'
import { declineUserJoinRequest, validateJoinRequest } from '../action/admin.ts'
import { getBanInfo } from '../action/ban.ts'
import { requestUserContact } from '../action/user.ts'
import { ChatJoinRequest } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { User } from '../type/user.type.ts'
import { link, text } from '../util/markdown.ts'
import { int } from '../util/system.ts'

const bot = new Composer<BotContext>()

bot.command(`start`, (ctx: BotContext) => {
	return ctx.replyFmt(`Привет, ${ctx.user.identity}!`)
})

export const userCommandsComposer = bot
