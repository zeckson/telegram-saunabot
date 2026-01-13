import { FormattedString, } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { notifyAdmins } from './notify-admin.ts'

export const notifyAllAdmins = (
	ctx: BotContext,
	message: string | FormattedString,
	other?: object,
) => {
	let params: object = {}
	if ((message as FormattedString).entities) {
		params = { entities: message.entities, ...other }
		message = message.toString()
	} else {
		params = { parse_mode: 'MarkdownV2', ...other }
	}
	return notifyAdmins((id: number) =>
		ctx.api.sendMessage(id, message as string, {
			link_preview_options: { is_disabled: true },
			...params,
		})
	)
}
