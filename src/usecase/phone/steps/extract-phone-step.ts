import { Step } from '../../sequence.type.ts'
import type { PhoneFlowContext } from '../phone-context.ts'

export const extractPhoneStep: Step<PhoneFlowContext> = (ctx) => {
	ctx.phone = ctx.message?.contact?.phone_number ?? undefined
	return Promise.resolve({ ok: true })
}
