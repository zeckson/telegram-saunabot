import { CallbackQuery } from 'grammy/types'
import { BotContext } from '../../type/context.ts'
import { JoinRequestAction } from '../../type/join-request.ts'

export interface JoinRequestData {
	action: JoinRequestAction
	userId: number
	chatId: number
}

export type CallbackContextFlow = BotContext & {
	callbackQuery?: CallbackQuery
	data: JoinRequestData
}
