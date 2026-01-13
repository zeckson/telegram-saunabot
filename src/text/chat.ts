import { Chat, fmt, FormattedString, link } from '../deps.ts'

const UNKNOWN = fmt`<неизвестно>`
export const chatLink = (chat?: Chat): FormattedString => {
	if (!chat) {
		return UNKNOWN
	}
	const title = chat.title ?? chat.type
	return chat.username
		? link(title, `tg://resolve?domain=${chat.username}`)
		: new FormattedString(title, [])
}
