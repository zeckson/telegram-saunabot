// src/usecase/pipeline.ts
import { run, Step } from "./pipeline.ts"

export const branch = <TCtx>(
	predicate: (ctx: TCtx) => boolean | Promise<boolean>,
	ifTrue: Step<TCtx>[],
	ifFalse: Step<TCtx>[],
): Step<TCtx> =>
async (ctx, name) => {
  const ok = await predicate(ctx)
	return run(`${name}:branch:${ok}`, ctx, ok ? ifTrue : ifFalse)
}
