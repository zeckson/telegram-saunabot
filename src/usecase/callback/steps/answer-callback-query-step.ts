import { GrammyError } from '../../../deps.ts'
import { notifyAllAdmins } from "../../../util/notifier.ts"
import { StepOutcome } from '../../sequence.type.ts'
import { CallbackContextFlow } from '../callback-context.type.ts'
import { chatJoinAction, notifyError } from '../callback.messages.ts'

const getErrorMessage = (reason: unknown): string => {
	if (typeof reason === 'string') return reason
	if (reason instanceof Error) return reason.message
	return 'Unknown error'
}

export const answerCallbackQueryStep = async (
	result: StepOutcome,
	ctx: CallbackContextFlow,
) => {
	if (result.ok) {
		await ctx.answerCallbackQuery(chatJoinAction(ctx.data.action))
	} else {
		const errorMessage = getErrorMessage(result.reason ?? result.error)
		await ctx.answerCallbackQuery(errorMessage)

		if (result.error instanceof GrammyError) {
			const message = notifyError(
				ctx.user,
				ctx.data,
				result.error,
			)
			await notifyAllAdmins(ctx, message)
		}
	}

	await ctx.editMessageReplyMarkup({ reply_markup: undefined })
}
