export type StepOutcome = { ok: true } | { ok: false; reason?: string }

export type Step<TCtx> = (
  ctx: TCtx,
  name?: string,
) => Promise<StepOutcome> | StepOutcome

export type Sequence<TCtx> = (
  name: string,
  steps: Step<TCtx>[],
) => Step<TCtx>
