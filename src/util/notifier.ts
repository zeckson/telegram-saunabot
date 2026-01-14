import { FormattedString } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { Config } from './config.ts'

export const notifyAdmins = (
	action: (id: number) => Promise<unknown>,
): Promise<unknown[]> => {
	const responses = []

	for (const id of Config.ADMIN_IDS) {
		responses.push(action(id))
	}

	return Promise.all(responses)
}
export const notifyAllAdmins = (
	ctx: BotContext,
	message: FormattedString,
	other?: object,
) => {
	return notifyAdmins((id: number) =>
		ctx.api.sendMessage(id, message.toString(), {
			link_preview_options: { is_disabled: true },
      disable_notification: true,
			...{ entities: message.entities, ...other },
		})
	)
}
