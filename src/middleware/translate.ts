import { Bot, I18n } from '../deps.ts'
import { BotContext } from '../type/context.ts'

export const setupTranslate = async (bot: Bot<BotContext>) => {
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
      }
    },
  })

  // Translation files loaded this way works in Deno Deploy, too.
  await i18n.loadLocalesDir('locales')

  // Finally, register the i18n instance in the bot,
  // so the messages get translated on their way!
  bot.use(i18n)

  // Listen for messages
  bot.command(`start`, (ctx: BotContext) => {
    return ctx.reply(ctx.t(`greeting`))
  })
}
