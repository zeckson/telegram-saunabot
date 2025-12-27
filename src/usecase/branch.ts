import { pipeline } from './pipeline.ts'
import { Step } from './sequence.type.ts'

export const branch = <TCtx>(
	predicate: (ctx: TCtx) => boolean | Promise<boolean>,
	ifTrue: Step<TCtx>[],
	ifFalse: Step<TCtx>[],
): Step<TCtx> =>
	async function branch(ctx, name) {
		const ok = await predicate(ctx)
		const next = pipeline(`${name}:branch:${ok}`, ok ? ifTrue : ifFalse)
		return next(ctx)
	}
