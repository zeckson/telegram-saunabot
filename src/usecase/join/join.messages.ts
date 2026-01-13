import { bold, Chat, fmt, FormattedString, italic, link } from '../../deps.ts'
import { chatLink } from '../../text/chat.ts'
import { userLink } from '../../text/user.ts'
import { User } from '../../type/user.type.ts'
import hashtag from '../../util/hashtag.ts'
import { text } from '../../util/markdown.ts'

const privacyPolicy = `https://snezhdanov.ru/privacy-policy`

export const shareContactButtonName = 'Отправить контакт'

export const chatJoinVerifyMessage = (
	from: User,
	chat: Chat,
): FormattedString =>
	fmt`Здравствуйте, ${bold(text(from.fullName))}!
    
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
	fmt`Не удалось отправись запрос пользователю ${hashtag(user.id)}
Запрос от ${userLink(user)}. Текст ошибки:
  ${errorMessage}`
