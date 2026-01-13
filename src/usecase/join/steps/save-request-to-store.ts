import { AccessStore } from '../../../store/access-store.ts'
import { Step } from '../../sequence.type.ts'
import type { JoinFlowContext } from '../join-context.ts'

export const saveRequestToStore: Step<JoinFlowContext> = async (ctx) => {
	const chat = ctx.chat
	const from = ctx.user

	const accessStore = new AccessStore(ctx.store)
	await accessStore.request(from, chat)

	return { ok: true }
}
