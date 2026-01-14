export type Reason = string
export type StepOutcome =
	| { ok: true }
	| { ok: false; reason?: Reason; error?: Error }

export type Step<TCtx> = (
	ctx: TCtx,
	parentName?: string,
) => Promise<StepOutcome> | StepOutcome
