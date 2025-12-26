// src/usecase/pipeline.ts
import { branch } from './branch.ts'

export type StepOutcome = { ok: true } | { ok: false; reason?: string }

export type Step<TCtx> = (
	ctx: TCtx,
	name?: string,
) => Promise<StepOutcome> | StepOutcome

export const run = async <TCtx>(
	name: string,
	ctx: TCtx,
	steps: Step<TCtx>[],
): Promise<StepOutcome> => {
	console.debug(`${name}: ${steps.length} steps`)
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i]
		const stepid = `${step.name ?? `anonymous`} ${i + 1}/${steps.length}`
		console.debug(`${name}: executing step ${stepid} `)
		const res = await step(ctx, name)
		if (!res.ok) {
			console.warn(
				`${name}: failed at step ${stepid}: ${
					res.reason ?? 'unknown reason'
				}`,
			)
			return res
		}
	}
	console.debug(`${name}: completed successfully`)
	return { ok: true } as const
}

export const pipeline = <TCtx>(name: string, steps: Step<TCtx>[]): Step<TCtx> => (ctx) => run(name, ctx, steps)

export { branch }
