import { getBanInfo } from '../../../tools/ban.ts'
import { Step } from '../../sequence.type.ts'
import { JoinFlowContext } from '../join-context.ts'

export const fetchBanStatus: Step<JoinFlowContext> = async (ctx) => {
	ctx.banStatus = await getBanInfo(ctx.user.id)

	return { ok: true }
}
