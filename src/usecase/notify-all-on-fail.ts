import { blockquote, fmt } from '../deps.ts'
import { hashtag } from '../text/id.ts'
import { userLink } from '../text/user.ts'
import { BotContext } from '../type/context.ts'
import { notifyAllAdmins } from "../util/notifier.ts"
import { StepOutcome } from './sequence.type.ts'

export const notifyAllOnFail = async (
	outcome: Promise<StepOutcome> | StepOutcome,
	ctx: BotContext,
) => {
	const result = await outcome
	if (!result.ok && result.error) {
		const error = result.error

		await notifyAllAdmins(
			ctx,
			fmt`Ошибка при обработке заявки ${hashtag(ctx.user.id)}
Запрос от ${userLink(ctx.user)}. Текст ошибки:
  ${blockquote(error.message)}`,
		)
	}
}
