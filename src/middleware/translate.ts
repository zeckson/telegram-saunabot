import { TranslationVariables } from "https://deno.land/x/grammy_i18n@v1.0.2/types.ts"
import { Bot, Context, I18n, I18nFlavor, NextFunction } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { getFullName } from '../util/username.ts'

// For TypeScript and auto-completion support,
// extend the context with I18n's flavor:

type Tail<T extends Array<unknown>> = T extends
  [head: infer E1, ...tail: infer E2] ? E2
  : [];

export type TranslateFlavor<C extends Context> = C & I18nFlavor & {
  replyT(key: string, params: TranslationVariables, args: Tail<Parameters<C["reply"]>>): void;
};


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

  bot.use(async <C extends Context>(
    ctx: TranslateFlavor<C>,
    next: NextFunction,
  ) => {
    ctx.replyT = (key, params, args) => {
      const parseMode = `MarkdownV2`;
      const [payload, ...rest] = args;
      return ctx.reply(
        ctx.t(key, params),
        { ...payload, parse_mode: parseMode },
        ...rest,
      );
    };

    await next();
  })
}
