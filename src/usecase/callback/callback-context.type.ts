import { CallbackQuery } from 'grammy/types'
import { JoinRequestAction } from '../../action/admin.ts'
import { BotContext } from '../../type/context.ts'

export interface JoinRequestData {
	action: JoinRequestAction
	userId: number
	chatId: number
}

export type CallbackContextFlow = BotContext & {
	callbackQuery: CallbackQuery
	data: JoinRequestData
}
