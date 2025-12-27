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

const getErrorMessage = (reason: unknown): string => {
  if (typeof reason === 'string') return reason
  if (reason instanceof Error) return reason.message
  return 'Unknown error'
}

const answerCallbackQuery = async (
  result: StepOutcome,
  ctx: CallbackContextFlow,
) => {
  if (result.ok) {
    await ctx.answerCallbackQuery(Messages.chatJoinAction(ctx.data.action))
  } else {
    const errorMessage = getErrorMessage(result.reason)
    await ctx.answerCallbackQuery(errorMessage)

    if (result.reason instanceof GrammyError) {
      const message = Messages.notifyError(
        ctx,
        ctx.data.userId,
        result.reason,
      )
      await notifyAllAdmins(ctx, message)
    }
	}

	await ctx.editMessageReplyMarkup({ reply_markup: undefined })
}
export const handleCallbackData = async (ctx: CallbackContextFlow) => {
	const result = await handleCallback(ctx)
	await answerCallbackQuery(result, ctx)
	return result
}
