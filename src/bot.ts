import { GroupContext } from "./context.ts"
import { Bot, I18n, I18nFlavor } from './deps.ts'
import { requireEnv } from './env-util.ts'
import { isInChat } from './middleware/guard.ts'
import { log } from './middleware/log.ts'

const TELEGRAM_TOKEN = requireEnv(`TELEGRAM_TOKEN`, true)
const SAUNA_CHAT_ID_NAME = parseInt(requireEnv(`SAUNA_CHAT_ID`), 10)

type BotContext = GroupContext & I18nFlavor;
// Create bot object
const bot = new Bot<BotContext>(TELEGRAM_TOKEN)

bot.use(log)
const isInSaunaChat = isInChat(SAUNA_CHAT_ID_NAME)
bot.use(isInSaunaChat)

// For TypeScript and auto-completion support,
// extend the context with I18n's flavor:

// Create an `I18n` instance.
// Continue reading to find out how to configure the instance.
const i18n = new I18n<BotContext>({
    defaultLocale: `ru`,
    localeNegotiator: () => `ru`, // Default everything to ru
    globalTranslationContext(ctx) {
        return {
            username: ctx.user.fullName,
        };
    },
});

// Translation files loaded this way works in Deno Deploy, too.
await i18n.loadLocalesDir("locales");

// Finally, register the i18n instance in the bot,
// so the messages get translated on their way!
bot.use(i18n);

// Listen for messages
bot.command(`start`, (ctx: BotContext) => {
    return ctx.reply(ctx.t(`greeting`))
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
