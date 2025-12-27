import { pipeline } from './pipeline.ts'
import { Step } from './sequence.type.ts'

type TKey = string

type Cases<TCtx, T extends TKey> = {
	[key in T]?: Step<TCtx>[]
} & { default: Step<TCtx>[] }

export const when = <TCtx, T extends TKey>(
	getter: (ctx: TCtx) => T | Promise<T>,
	cases: Cases<TCtx, T>,
): Step<TCtx> =>
async (ctx, name) => {
	const key = await getter(ctx)
	const branch = cases[key] ?? cases.default
	const next = pipeline(`${name}:when:${key}`, branch)
	return next(ctx)
}
