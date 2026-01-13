import type { PhoneFlowContext } from '../phone-context.ts'
import { adminAssistMessage } from '../phone.messages.ts'

export const notifyUserNoContact = async (context: PhoneFlowContext) => {
	await context.replyFmt(adminAssistMessage())
	return { ok: true }
}
