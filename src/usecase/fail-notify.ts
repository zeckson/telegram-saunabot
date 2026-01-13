import { notifyAllAdmins } from "../action/admin.ts"
import { blockquote, fmt } from "../deps.ts"
import { hashtag } from "../text/id.ts"
import { userLink } from "../text/user.ts"
import { BotContext } from "../type/context.ts"
import { StepOutcome } from "./sequence.type.ts"

export const failNotify = async (
	outcome: Promise<StepOutcome> | StepOutcome,
	ctx: BotContext,
) => {
	const result = await outcome
	if (!result.ok) {
		const reason = result.reason!!
		const message = reason instanceof Error ? reason.message : reason
		await notifyAllAdmins(
			ctx,
			fmt`Ошибка при обработке заявки ${hashtag(ctx.user.id)}
Запрос от ${userLink(ctx.user)}. Текст ошибки:
  ${blockquote(message)}`,
		)
	}
}
