import { fmt, FormattedString } from '../../deps.ts'
import { GrammyError } from '../../deps.ts'
import { hashtag } from "../../text/id.ts"
import { userLink } from '../../text/user.ts'
import { JoinRequestAction } from '../../type/join-request.ts'
import { User } from '../../type/user.type.ts'
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
): FormattedString => {
	return fmt`Не удалось ${status(data)} заявку ${hashtag(data.userId)}
Запрос от ${userLink(user)}. Текст ошибки:
  ${getMessageByError(e)}`
}
