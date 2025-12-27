import { pipeline } from './pipeline.ts'
import { Step } from './sequence.type.ts'

export const other = Symbol(`other`)

type TKey = string

type Cases<TCtx, T extends TKey> =
	& {
		[key in T]?: Step<TCtx>[]
	}
	& { [other]: Step<TCtx>[] }

export const when = <TCtx, T extends TKey>(
	getter: (ctx: TCtx) => T | Promise<T>,
	cases: Cases<TCtx, T>,
): Step<TCtx> =>
	async function when(ctx, name) {
		const key = await getter(ctx)
		const branch = cases[key] ?? cases[other]
		const next = pipeline(`${name}:when:${key}`, branch)
		return next(ctx)
	}
