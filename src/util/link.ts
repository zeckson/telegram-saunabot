import { Chat } from "../deps.ts"
import { chatLink, text } from "./markdown.ts"

export const getChatLink = (chat: Chat) => {
  const title = chat.title ?? chat.type
  return chat.username
    ? chatLink(title, chat.username)
    : text(title)
}
