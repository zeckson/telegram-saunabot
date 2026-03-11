import type { Chat } from '../../deps.ts'
import type { BotContext } from '../../type/context.ts'

export type PhoneFlowContext = BotContext & {
	phone?: string
	approvedChats?: Chat[]
}
