import { GrammyError } from '../../../deps.ts'
import { Messages } from '../../../action/admin.messages.ts'
import { notifyAllAdmins } from '../../../action/admin.ts'
import { StepOutcome } from '../../sequence.type.ts'
import { CallbackContextFlow } from '../callback-context.type.ts'
import { chatJoinAction, notifyError } from "../callback.messages.ts"

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
		const errorMessage = getErrorMessage(result.reason)
		await ctx.answerCallbackQuery(errorMessage)

		if (result.reason instanceof GrammyError) {
			const message = notifyError(
				ctx.user,
				ctx.data,
				result.reason,
			)
			await notifyAllAdmins(ctx, message)
		}
	}

	await ctx.editMessageReplyMarkup({ reply_markup: undefined })
}
