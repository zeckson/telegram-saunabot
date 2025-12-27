import { JoinRequestAction } from '../../../action/admin.ts'
import { CallbackContextFlow } from '../callback-context.type.ts'

export const extractActionStep = (ctx: CallbackContextFlow) => {
	const data = ctx.callbackQuery.data
	if (!data) {
		return { ok: false, reason: 'missing_callback_data' }
	}
	const [actionValue, chatId, userId, _updateId] = data.split(`:`)
	const action = actionValue as JoinRequestAction
	if (!action) {
		return { ok: false, reason: 'invalid_callback_data' }
	}
	ctx.data = { action, chatId: Number(chatId), userId: Number(userId) }

	return { ok: true }
}
