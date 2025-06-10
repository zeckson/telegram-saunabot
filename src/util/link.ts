import { Chat, link } from '../deps.ts'

export const getFormattedChatLink = (chat: Chat) => {
	const title = chat.title ?? chat.type
	return chat.username
		? link(title, `tg://resolve?domain=${chat.username}`)
		: title
}
