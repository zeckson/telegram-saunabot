// src/usecase/pipeline.ts
export type StepOutcome = { ok: true } | { ok: false; reason?: string }

export type Step<TCtx> = (ctx: TCtx) => Promise<StepOutcome> | StepOutcome

export const runPipeline = async <TCtx>(ctx: TCtx, steps: Step<TCtx>[]): Promise<StepOutcome> =>
  run(`unnamed`, ctx, steps)

export const run = async <TCtx>(name: string, ctx: TCtx, steps: Step<TCtx>[]): Promise<StepOutcome> => {
  console.debug(`Starting pipeline "${name}" with ${steps.length} steps`)
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    console.debug(`${name}: executing step ${step.name} ${i + 1}/${steps.length} `)
    const res = await step(ctx)
    if (!res.ok) {
      console.warn(`Pipeline failed at step ${step.name} ${i + 1}: ${res.reason ?? 'unknown reason'}`)
      return res
    }
  }
  console.debug(`Pipeline "${name}" completed successfully`)
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
