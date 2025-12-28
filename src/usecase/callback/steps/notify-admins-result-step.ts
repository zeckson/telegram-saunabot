import { Messages } from '../../../action/admin.messages.ts'
import { notifyAllAdmins } from '../../../action/admin.ts'
import { StepOutcome } from '../../sequence.type.ts'
import { CallbackContextFlow } from '../callback-context.type.ts'

export const notifyAdminsApprovedStep = async (
	ctx: CallbackContextFlow,
): Promise<StepOutcome> => {
	const userId = ctx.data.userId
	await notifyAllAdmins(ctx, Messages.notifyJoinApproved(ctx, userId))
	return { ok: true }
}

export const notifyAdminsRejectedStep = async (
	ctx: CallbackContextFlow,
): Promise<StepOutcome> => {
	const userId = ctx.data.userId
	await notifyAllAdmins(ctx, Messages.notifyJoinRejected(ctx, userId))
	return { ok: true }
}
