import { Step } from '../../sequence.type.ts'
import type { PhoneFlowContext } from '../phone-context.ts'
import { UserStore } from '../../../store/user-store.ts'

export const savePhoneStep: Step<PhoneFlowContext> = async (ctx) => {
	if (!ctx.phone) return { ok: false, reason: 'missing_phone_in_ctx' }
	const userStore = new UserStore(ctx.store)
	await userStore.savePhone(ctx.user.id, ctx.phone)
	return { ok: true }
}
