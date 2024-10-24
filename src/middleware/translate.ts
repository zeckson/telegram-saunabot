import { Bot, I18n, NextFunction } from '../deps.ts'
import { BotContext } from '../type/context.ts'
// For TypeScript and auto-completion support,
// extend the context with I18n's flavor:

// Create an `I18n` instance.
// Continue reading to find out how to configure the instance.
const i18n = new I18n<BotContext>({
  defaultLocale: `ru`,
  localeNegotiator: () => `ru`, // Default everything to ru
  globalTranslationContext(_ctx: BotContext) {
    return {}
  },
})

export const registerTranslate = async (bot: Bot<BotContext>) => {
  // Translation files loaded this way works in Deno Deploy, too.
  await i18n.loadLocalesDir('locales')

  // Finally, register the i18n instance in the bot,
  // so the messages get translated on their way!
  bot.use(i18n)

  bot.use(async (
    ctx: BotContext,
    next: NextFunction,
  ) => {
    ctx.replyT = (key, params, other?) => {
      return ctx.reply(
        ctx.t(key, params),
        { ...other, parse_mode: `MarkdownV2` }
      )
    }

    await next()
  })
}
