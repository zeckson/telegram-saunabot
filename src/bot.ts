import { Bot, Context, NextFunction } from './deps.ts'
import { requireEnv } from './env-util.ts'
import { isInChat } from './middleware/guard.ts'
import { log } from './middleware/log.ts'

const TELEGRAM_TOKEN = requireEnv(`TELEGRAM_TOKEN`, true)
const SAUNA_CHAT_ID_NAME = requireEnv(`SAUNA_CHAT_ID`)

// Create bot object
const bot = new Bot(TELEGRAM_TOKEN)

bot.use(log)

// Listen for messages
const isInSaunaChat = isInChat(SAUNA_CHAT_ID_NAME)
bot.command(`start`, isInSaunaChat, (ctx) => {
  return ctx.reply(`Welcome! Send me a photo!`)
})

bot.on(`message:text`, (ctx) => ctx.reply(`That is text and not a photo!`))
bot.on(`message:photo`, (ctx) => ctx.reply(`Nice photo! Is that you?`))

bot.on(
  `edited_message`,
  (ctx) =>
    ctx.reply(`Ha! Gotcha! You just edited this!`, {
      reply_to_message_id: ctx.editedMessage.message_id,
    }),
)

export { bot }
