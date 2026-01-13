import { getBanInfo } from '../../../action/ban.ts'
import { Step } from '../../sequence.type.ts'
import { BanStatus, JoinFlowContext } from '../join-context.ts'

export const fetchBanStatus: Step<JoinFlowContext> = async (ctx) => {
	const info = await getBanInfo(ctx.user.id)
	const banned = info.length > 0

	ctx.banStatus = {
		// TODO: add fetch fail status
		status: banned ? BanStatus.BANNED : BanStatus.NOT_BANNED,
		info,
	}

	return { ok: true }
}
