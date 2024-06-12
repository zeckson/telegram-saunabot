import { UserContext } from './context.ts'
import { Bot, I18nFlavor } from './deps.ts'
import { requireEnv } from './env-util.ts'
import { log } from './middleware/log.ts'
import { getUsername } from "./util/username.ts"

const TELEGRAM_TOKEN = requireEnv(`TELEGRAM_TOKEN`, true)
const ADMIN_ID = parseInt(requireEnv(`ADMIN_ID`), 10)

type BotContext = UserContext & I18nFlavor;
// Create bot object
const bot = new Bot<BotContext>(TELEGRAM_TOKEN)

bot.use(log)

bot.on(`chat_join_request`, async (ctx) => {
  const chat = ctx.chat;
  const from = ctx.from;
  await bot.api.sendMessage(ADMIN_ID, `Новая заявка на добавление от ${getUsername(from)} в чат "${chat.title}"
Проверить пользователя можно по сыылке:
https://t.me/lolsbotcatcherbot?start=${from.id}`)
})

bot.on(`my_chat_member`, (ctx) => {
  console.dir(ctx.myChatMember);
});

export { bot }
export const printBotInfo = () => {
  console.log(`Bot has been started: 
  https://t.me/${bot.botInfo.username}
  tg://resolve?domain=${bot.botInfo.username}&start=test`)
}
