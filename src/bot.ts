import { UserContext } from './context.ts'
import { Bot, I18nFlavor, InlineKeyboard } from './deps.ts'
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

  const keyboard = [[
    InlineKeyboard.text(`Подтвердить`, `approve:${chat.id}:${from.id}`),
    InlineKeyboard.text(`Отклонить`, `reject:${chat.id}:${from.id}`)
  ]]

  await bot.api.sendMessage(ADMIN_ID, `Новая заявка на добавление от ${getUsername(from)} в чат "${chat.title}"
Проверить пользователя можно по сыылке:
https://t.me/lolsbotcatcherbot?start=${from.id}`, {
    link_preview_options: { is_disabled: true },
    reply_markup: new InlineKeyboard(keyboard)
  })
})

const handleQuery = async (ctx: BotContext) => {
  const data = ctx.callbackQuery?.data ?? ``
  const [action, chatId, userId] = data.split(`:`)

  let result = `Неизвестная команда`
  switch (action) {
    case `approve`:
      bot.api.approveChatJoinRequest(chatId, parseInt(userId, 10)).catch((e) => console.error(`Approve failed: ${e}`))
      result = `Добавлен в группу`
      break
    case `reject`:
      bot.api.declineChatJoinRequest(chatId, parseInt(userId, 10)).catch((e) => console.error(`Decline failed: ${e}`))
      result = `Отклонён`
      break
    default:
      console.error(`Unknown action: ${action}`)
  }
  return result
}

// TODO: Prevent access from other
bot.on(`callback_query:data`, async (ctx) => {
  const result = await handleQuery(ctx)

  await ctx.answerCallbackQuery(result)

  await ctx.deleteMessage()
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
