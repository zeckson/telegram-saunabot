import { Bot, I18n } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { getFullName } from '../util/username.ts'

// For TypeScript and auto-completion support,
// extend the context with I18n's flavor:

// Create an `I18n` instance.
// Continue reading to find out how to configure the instance.
const i18n = new I18n<BotContext>({
  defaultLocale: `ru`,
  localeNegotiator: () => `ru`, // Default everything to ru
  globalTranslationContext(ctx: BotContext) {
    const fullName = getFullName(ctx.from)
    return {
      /** @deprecated use fullName **/
      username: fullName,
      fullName,
      ...ctx.from,
    }
  },
})

export const registerTranslate = async (bot: Bot<BotContext>) => {
  // Translation files loaded this way works in Deno Deploy, too.
  await i18n.loadLocalesDir('locales')

  // Finally, register the i18n instance in the bot,
  // so the messages get translated on their way!
  bot.use(i18n)
}
