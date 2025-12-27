import { Step, StepOutcome } from './sequence.type.ts'

const run = async <TCtx>(
	name: string,
	steps: Step<TCtx>[],
	ctx: TCtx,
): Promise<StepOutcome> => {
	console.debug(`${name} ${steps.length} steps`)
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i]
		const stepName = `${name}:${step.name ?? `anonymous`}`
		const stepid = `${i + 1}/${steps.length}`
		console.debug(`${stepName} executing step ${stepid} `)
		try {
      const res = await step(ctx, name)
      if (!res.ok) {
        console.warn(
          `${stepName} returned "false" with reason: ${
            res.reason ?? 'unknown reason'
          }`,
        )
        return res
      }
      console.debug(`${stepName} completed successfully`)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      console.error(`${stepName} failed with error: ${message}`)
      return { ok: false, reason: message } as const
    }
	}
	console.debug(`${name} completed successfully`)
	return { ok: true } as const
}

export const pipeline =
	<TCtx>(name: string, steps: Step<TCtx>[]): Step<TCtx> => (ctx) =>
		run(name, steps, ctx)
