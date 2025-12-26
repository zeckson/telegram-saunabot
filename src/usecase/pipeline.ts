import { branch } from './branch.ts'
import { Step, StepOutcome } from "./sequence.type.ts"

const run = async <TCtx>(
	name: string,
	steps: Step<TCtx>[],
	ctx: TCtx,
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

export const pipeline = <TCtx>(name: string, steps: Step<TCtx>[]): Step<TCtx> => (ctx) => run(name, steps, ctx)

export { branch }
