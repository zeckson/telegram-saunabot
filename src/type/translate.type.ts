import { Context, I18nFlavor, TranslationVariables } from "../deps.ts"

type Tail<T extends Array<unknown>> = T extends
  [head: infer E1, ...tail: infer E2] ? E2
  : []

export type TranslateFlavor<C extends Context> = C & I18nFlavor & {
  replyT(
    key: string,
    params: TranslationVariables,
    ...args: Tail<Parameters<C['reply']>>
  ): ReturnType<C["reply"]>
}
