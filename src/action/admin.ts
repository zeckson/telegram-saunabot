import { FormattedString } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { notifyAdmins } from './notify-admin.ts'

export const notifyAllAdmins = (
	ctx: BotContext,
	message: FormattedString,
	other?: object,
) => {
	return notifyAdmins((id: number) =>
		ctx.api.sendMessage(id, message.toString(), {
			link_preview_options: { is_disabled: true },
			...{ entities: message.entities, ...other },
		})
	)
}
