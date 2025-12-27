import {  Step, StepOutcome } from './sequence.type.ts'

type StepGenerator<TCtx> = (name?: string) => Generator<Step<TCtx>>

const run = async <TCtx>(
  generator: StepGenerator<TCtx>,
  ctx: TCtx,
): Promise<StepOutcome> => {
  const name = generator.name
  let stepIndex = 0

  console.debug(`${name} starting generator`)
  const iterator = generator(name)
  let it = iterator.next(name)
  while (!it.done) {
    const step = it.value

    stepIndex++
    const stepName = `${name}:${step.name == `` ? `anonymous` : step.name}`
    console.debug(`${stepName} executing step ${stepIndex}`)
    try {
      const res = await step(ctx)
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
    it = iterator.next(name)
  }
  console.debug(`${name} completed successfully`)
  return { ok: true } as const
}

export const generator =
	<TCtx>(generator: StepGenerator<TCtx>): Step<TCtx> => (ctx) => run(generator, ctx)
