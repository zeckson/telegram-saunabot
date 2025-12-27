export type Reason = string | Error
export type StepOutcome = { ok: true } | { ok: false; reason?: Reason }

export type Step<TCtx> = (
  ctx: TCtx,
  name?: string,
) => Promise<StepOutcome> | StepOutcome

export type Sequence<TCtx> = {
  name: string,
  steps: Step<TCtx>[]
}
