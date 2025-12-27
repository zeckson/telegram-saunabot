import { Messages } from "../../../action/admin.messages.ts"
import { JoinRequestAction, notifyAllAdmins } from '../../../action/admin.ts'
import { StepOutcome } from "../../sequence.type.ts"
import { CallbackContextFlow } from '../callback-context.type.ts'

export const notifyAdminsResultStep = async (
	ctx: CallbackContextFlow,
): Promise<StepOutcome> => {
	const action = ctx.data.action
	const userId = ctx.data.userId
	try {
		switch (action) {
			case JoinRequestAction.APPROVE:
				await notifyAllAdmins(ctx, Messages.notifyJoinApproved(ctx, userId))
				return { ok: true }
			case JoinRequestAction.DECLINE:
        await notifyAllAdmins(ctx, Messages.notifyJoinRejected(ctx, userId))
				return { ok: true }
			default:
				return { ok: false, reason: 'unknown_action' }
		}
	} catch (e: Error | unknown) {
		return { ok: false, reason: e as Error }
	}
}
