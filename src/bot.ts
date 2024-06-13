import { UserContext } from './context.ts'
import { API_CONSTANTS, Bot, I18nFlavor, InlineKeyboard } from './deps.ts'
import { log } from './middleware/log.ts'
import { requireEnv } from './util/environment.ts'
import { int } from "./util/system.ts"
import { getUsername } from "./util/username.ts"

const TELEGRAM_TOKEN = requireEnv(`TELEGRAM_TOKEN`, true)
const ADMIN_ID = int(requireEnv(`ADMIN_ID`))

type BotContext = UserContext & I18nFlavor;
// Create bot object
const bot = new Bot<BotContext>(TELEGRAM_TOKEN)

bot.use(log)

const APPROVE_ACTION = `approve`
const DECLINE_ACTION = `reject`

bot.on(`chat_join_request`, async (ctx) => {
  const chat = ctx.chat;
  const from = ctx.from;

  const keyboard = [[
    InlineKeyboard.text(`Подтвердить`, `${APPROVE_ACTION}:${chat.id}:${from.id}`),
    InlineKeyboard.text(`Отклонить`, `${DECLINE_ACTION}:${chat.id}:${from.id}`)
  ]]

  await bot.api.sendMessage(ADMIN_ID, `Новая заявка на добавление от ${getUsername(from)} в чат "${chat.title}"
Проверить пользователя можно по сыылке:
https://t.me/lolsbotcatcherbot?start=${from.id}`, {
    link_preview_options: { is_disabled: true },
    reply_markup: new InlineKeyboard(keyboard)
  })
})

const handleQuery = (ctx: BotContext) => {
  const data = ctx.callbackQuery?.data ?? ``
  const [action, chatId, userId] = data.split(`:`)

  let result = `Неизвестная команда`
  switch (action) {
    case APPROVE_ACTION:
      bot.api.approveChatJoinRequest(chatId, int(userId)).catch((e) => console.error(`Approve failed: ${e}`))
      result = `Добавлен в группу`
      break
    case DECLINE_ACTION:
      bot.api.declineChatJoinRequest(chatId, int(userId)).catch((e) => console.error(`Decline failed: ${e}`))
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
export const onAfterInit = () => {
  console.log(`Bot has been started: 
  https://t.me/${bot.botInfo.username}
  tg://resolve?domain=${bot.botInfo.username}&start=test`)
}

export const DEFAULT_CONFIG = { allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES }
