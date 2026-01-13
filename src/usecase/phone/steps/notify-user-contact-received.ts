import type { PhoneFlowContext } from '../phone-context.ts'
import { successMessage } from '../phone.messages.ts'

export const notifyUserContactReceived = async (context: PhoneFlowContext) => {
	await context.replyFmt(successMessage(), {
		reply_markup: {
			remove_keyboard: true, // Removes the reply keyboard
		},
	})
	return { ok: true }
}
