import { JoinRequestAction } from '../../type/join-request.ts'
import { JoinRequestData } from './callback-context.type.ts'

export const parseJoinRequestData = (
	data: string,
): JoinRequestData | undefined => {
	const [actionValue, chatId, userId, _updateId] = data.split(`:`)
	const action = actionValue as JoinRequestAction
	if (!action) {
		return undefined
	}
	return { action, chatId: Number(chatId), userId: Number(userId) }
}

export const stringifyJoinRequestData = (data: JoinRequestData): string => {
	return `${data.action}:${data.chatId}:${data.userId}`
}
