import { pipeline } from "../pipeline.ts"
import { CallbackContextFlow } from "./callback-context.type.ts"

const extractAction = (ctx: CallbackContextFlow) => {
  const data = ctx.callbackQuery.data
  if (!data) {
    return { ok: false }
  }
  return { ok: true, action: data }
}
const handleCallback = pipeline(`callback-data`, [extractAction])
export const handleCallbackData = (ctx: CallbackContextFlow) => {
  const data = ctx.callbackQuery.data
  if (!data) {
    return ctx.answerCallbackQuery()
  }

  handleCallback(ctx)
}
