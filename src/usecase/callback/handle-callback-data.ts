import { Messages } from "../../action/admin.messages.ts"
import { notifyAllAdmins } from "../../action/admin.ts"
import { GrammyError } from "../../deps.ts"
import { pipeline } from '../pipeline.ts'
import { StepOutcome } from "../sequence.type.ts"
import { CallbackContextFlow } from './callback-context.type.ts'
import { extractActionStep } from './steps/extract-action-step.ts'
import { handleJoinRequestStep } from "./steps/handle-join-request-step.ts"
import { notifyAdminsResultStep } from "./steps/notify-admins-result-step.ts"

const handleCallback = pipeline(`callback-data`, [
	extractActionStep,
	handleJoinRequestStep,
	notifyAdminsResultStep,
])

const answerCallbackQuery = async (
	result: StepOutcome,
	ctx: CallbackContextFlow,
) => {
	if (result.ok) {
		await ctx.answerCallbackQuery(Messages.chatJoinAction(ctx.data.action))
	} else {
		const reason = result.reason
		switch (typeof reason) {
			case 'string':
				await ctx.answerCallbackQuery(reason)
				break
			case 'object':
				if (reason instanceof Error) {
					await ctx.answerCallbackQuery(reason.message)
				}
				if (reason instanceof GrammyError) {
					const message = Messages.notifyError(
						ctx,
						ctx.data.userId,
						reason as GrammyError,
					)
					await notifyAllAdmins(ctx, message)
				}
				break
			default:
				await ctx.answerCallbackQuery('Unknown error')
		}
	}

	await ctx.editMessageReplyMarkup({ reply_markup: undefined })
}
export const handleCallbackData = async (ctx: CallbackContextFlow) => {
	const result = await handleCallback(ctx)
	await answerCallbackQuery(result, ctx)
	return result
}
