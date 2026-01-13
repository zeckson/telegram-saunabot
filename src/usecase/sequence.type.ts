export type Reason = string | Error
export type StepOutcome = { ok: true } | { ok: false; reason?: Reason }

export type Step<TCtx> = (
	ctx: TCtx,
	parentName?: string,
) => Promise<StepOutcome> | StepOutcome
