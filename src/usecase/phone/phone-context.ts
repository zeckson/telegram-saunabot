// src/usecase/phone/phone-context.ts
import type { BotContext } from "../../type/context.ts"

export type PhoneFlowContext = BotContext & {
  phone?: string
}
