import { bold, Chat, fmt, FormattedString, italic, link } from '../../deps.ts'
import { chatLink } from '../../text/chat.ts'
import { hashtag } from "../../text/id.ts"
import { userLink, verifyLink } from '../../text/user.ts'
import { User } from '../../type/user.type.ts'
import { BanData, BanStatus } from './join-context.ts'

const privacyPolicy = `https://snezhdanov.ru/privacy-policy`

export const shareContactButtonName = 'Отправить контакт'

export const chatJoinVerifyMessage = (
	from: User,
	chat: Chat,
): FormattedString =>
	fmt`Здравствуйте, ${bold(from.fullName)}!
    
Вы подали заявку на вступление в чат ${chatLink(chat)}.
В целях борьбы со спамом и спам-аккаунтами мы просим вас поделиться с нами вашими контактными данными.
Чтобы поделиться контактом нажмите кнопку ${bold(shareContactButtonName)}.
  
${
		italic(`Мы не храним и не предоставляем данные третьим лицам. 
Подробнее с политикой обработки персональных данных вы можете ознакомиться по `)
	}${link(`ссылке`, privacyPolicy)} 
    
${bold(`Благодарим за понимание!`)}
`

export const requestContactError = (
	user: User,
	errorMessage: string,
): FormattedString =>
	fmt`Не удалось отправить запрос пользователю ${hashtag(user.id)}
Запрос от ${userLink(user)}. Текст ошибки:
  ${errorMessage}`

const getStatus = (status: BanStatus): string => {
	switch (status) {
		case BanStatus.BANNED:
			return `забанен`
		case BanStatus.UNKNOWN:
			return `не удалось загрузить данные`
		case BanStatus.NOT_BANNED:
			return `в базах не упоминается`
	}
}

export const approveButtonText = `👍 Подтвердить`
export const declineButtonText = `👎 Отклонить`

export const onJoinRequest = (
	user: User,
	chat: Chat,
	banData: BanData,
): FormattedString => {
	return fmt`Заявка ${hashtag(user.id)} ${
		banData.status === BanStatus.BANNED ? bold(`🚫 Заблокирована!`) : ``
	}
Запрос на добавление пользователя ${userLink(user)} в чат ${chatLink(chat)}
Проверить пользователя можно по ${verifyLink(user.id)}
Информация о бане пользователя: ${bold(getStatus(banData.status))}
    ${
		fmt([
			...(banData.info.map((it) =>
				fmt`- в базе данных ${it.name}: ${link(`детали`, it.url)}\n`
			)),
		])
	}`
}
