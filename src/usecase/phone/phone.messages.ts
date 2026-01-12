import { Message } from 'grammy/types'
import { blockquote, fmt, FormattedString, } from 'https://deno.land/x/grammy_parse_mode@1.10.0/format.ts'
import { hashtag } from '../../text/id.ts'
import { userLink, verifyLink } from '../../text/user.ts'
import { User } from '../../type/user.type.ts'

export const userSentMessageNoContactAdminNotification = (
	from: User,
	message?: Message,
) => fmt`Заявка ${hashtag(from.id)}
Пользователь ${userLink(from)} прислал сообщение:
${blockquote(message?.text ?? 'no text')}
Проверить пользователя можно по ${verifyLink(from.id, `ссылке`)}`

export const userSentContactAdminNotification = (
	from: User,
	phone: string,
): FormattedString =>
	fmt`Заявка ${hashtag(from.id)}
Пользователь ${userLink(from)} прислал свои контактные данные:
${blockquote(phone)}
Проверить пользователя можно по ${verifyLink(from.id, `ссылке`)}`

export const successMessage = () =>
	fmt`Благодарим! Наши админы проверят информацию и добавят вас в группу!`

export const adminAssistMessage = () => 'Я передал ваши сообщения админу, ' +
  'но чтобы быстрее попасть в группу, ' +
  'пришлите пожалуйста контактные данные, ' +
  'выбрав кнопку снизу'
