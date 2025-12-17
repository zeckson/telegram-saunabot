// src/usecase/pipeline.ts
const logger = console

export type StepOutcome = { ok: true } | { ok: false; reason?: string }

export type Step<TCtx> = (ctx: TCtx) => Promise<StepOutcome> | StepOutcome

export const runPipeline = async <TCtx>(ctx: TCtx, steps: Step<TCtx>[]): Promise<StepOutcome> => {
  logger.debug(`Starting pipeline with ${steps.length} steps`)
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    logger.debug(`Executing step ${i + 1}/${steps.length}`)
    const res = await step(ctx)
    if (!res.ok) {
      logger.warn(`Pipeline failed at step ${i + 1}: ${res.reason ?? 'unknown reason'}`)
      return res
    }
  }
  logger.debug('Pipeline completed successfully')
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
