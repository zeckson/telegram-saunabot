import { notifyAllAdmins } from '../../../action/admin.ts'
import { StepOutcome } from '../../sequence.type.ts'
import { CallbackContextFlow } from '../callback-context.type.ts'
import { notifyAdmin } from '../callback.messages.ts'

export const notifyAdminsResultStep = async (
	ctx: CallbackContextFlow,
): Promise<StepOutcome> => {
	await notifyAllAdmins(ctx, notifyAdmin(ctx.user, ctx.data))
	return { ok: true }
}
