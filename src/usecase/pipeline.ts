import { Step, StepOutcome } from './sequence.type.ts'

const run = async <TCtx>(
	sequence: { name: string; steps: Step<TCtx>[] },
	ctx: TCtx,
): Promise<StepOutcome> => {
	const name = sequence.name
	const steps = sequence.steps

	console.debug(`${name} ${steps.length} steps`)
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i]
		const stepName = `${name}:${step.name == `` ? `anonymous` : step.name}`
		const stepid = `${i + 1}/${steps.length}`
		console.debug(`${stepName} executing step ${stepid} `)
		try {
			const res = await step(ctx, name)
			if (!res.ok) {
				console.warn(
					`${stepName} returned "false" with reason: ${
						res.reason ?? res.error?.message ?? 'unknown reason'
					}`,
				)
				return res
			}
			console.debug(`${stepName} completed successfully`)
		} catch (e) {
			const error = e instanceof Error ? e : new Error(String(e))
			console.error(`${stepName} failed with error: ${error.message}`)
			return { ok: false, error } as const
		}
	}
	console.debug(`${name} completed successfully`)
	return { ok: true } as const
}

export const pipeline = <TCtx>(
	name: string,
	steps: Step<TCtx>[],
	throwOnFalse = false,
): Step<TCtx> =>
async (ctx) => {
	const result = await run({ name, steps }, ctx)
	if (throwOnFalse && !result.ok) {
		if (result.error) {
			throw result.error
		}
		throw new Error(
			`Pipeline ${name} failed with reason: ${result.reason}`,
		)
	}
	return result
}
