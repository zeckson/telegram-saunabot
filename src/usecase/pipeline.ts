// src/usecase/pipeline.ts
export type StepOutcome = { ok: true } | { ok: false; reason?: string }

export type Step<TCtx> = (ctx: TCtx) => Promise<StepOutcome> | StepOutcome

export const runPipeline = async <TCtx>(ctx: TCtx, steps: Step<TCtx>[]) => {
  for (const step of steps) {
    const res = await step(ctx)
    if (!res.ok) return res
  }
  return { ok: true } as const
}

export const branch =
	<TCtx>(
		predicate: (ctx: TCtx) => boolean | Promise<boolean>,
		ifTrue: Step<TCtx>[],
		ifFalse: Step<TCtx>[],
	): Step<TCtx> =>
	async (ctx) => {
		const ok = await predicate(ctx)
		return runPipeline(ctx, ok ? ifTrue : ifFalse)
	}
