import { GrammyError, mentionUser } from '../../deps.ts'
import {
	fmt,
	FormattedString,
} from 'https://deno.land/x/grammy_parse_mode@1.10.0/format.ts'
import { JoinRequestAction } from '../../action/admin.ts'
import { userLink } from '../../text/user.ts'
import { BotContext } from '../../type/context.ts'
import { User } from '../../type/user.type.ts'
import hashtag from '../../util/hashtag.ts'
import { JoinRequestData } from './callback-context.type.ts'

export const chatJoinAction = (action: JoinRequestAction): string => {
	switch (action) {
		case JoinRequestAction.APPROVE:
			return `Добавлен в группу`
		case JoinRequestAction.DECLINE:
			return `Отклонён`
		default:
			return `Неизвестная команда`
	}
}

export const notifyAdmin = (
	admin: User,
	data: JoinRequestData,
): FormattedString =>
	fmt`Заявка ${hashtag(data.userId)} ${
		data.action == JoinRequestAction.APPROVE ? `принята` : `отклонена`
	} ${userLink(admin)}`

const status = (data?: JoinRequestData) => {
	switch (data?.action) {
		case JoinRequestAction.APPROVE:
			return `принять`
		case JoinRequestAction.DECLINE:
			return `отклонить`
		default:
			return `обработать`
	}
}

const getMessageByError = (e: GrammyError): string => {
	switch (e.error_code) {
		case 400:
			return `Ошибка 400: ${e.description}`
		case 403:
			return `Пользователь деактивирован`
		default:
			return e.message
	}
}

export const notifyError = (
	user: User,
	data: JoinRequestData,
	e: GrammyError,
): string | FormattedString => {
	return fmt`Не удалось ${status(data)} заявку ${hashtag(data.userId)}
Запрос от ${userLink(user)}. Текст ошибки:
  ${getMessageByError(e)}`
}
