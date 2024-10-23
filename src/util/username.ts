import { Chat } from '../deps.ts'
import { emojis } from "./emoji.ts"
import { text, chatLink, userLink } from "./markdown.ts"

const isNotEmpty = (strings: TemplateStringsArray, value: unknown) =>
  value ? `${strings[0]}${value}` : ``


type UserLike = {
  id: number
  /** True, if this user is a bot */
  is_bot: boolean
  /** User's or bot's first name */
  first_name: string
  /** User's or bot's last name */
  last_name?: string
  /** User's or bot's username */
  username?: string
  /** IETF language tag of the user's language */
  language_code?: string
  /** True, if this user is a Telegram Premium user */
  is_premium?: true
  /** True, if this user added the bot to the attachment menu */
  added_to_attachment_menu?: true
}

export const getUsername = (from?: UserLike) => {
  if (!from) return `unknown`

  const fromUsername = from.username ? `@${from.username}` : `unknown`

  return `${fromUsername}[${from.id}]`
}

export const getFullName = (from?: UserLike) => {
  if (!from) return `Unknown user`

  const identity = []

  identity.push(`[${from.id}${isNotEmpty`@${from.username}`}]`)
  identity.push(`${from.first_name}${isNotEmpty` ${from.last_name}`}`)
  from.is_bot ? identity.push(emojis.robot) : ``
  from.is_premium ? identity.push(emojis.premium) : ``

  return identity.join(` `)
}

export const getUserLink = (from?: UserLike) =>
  !from ? `Unknown user` : userLink(getFullName(from), from.id)

export const getChatLink = (chat: Chat) => {
  const title = chat.title ?? chat.type
  return chat.username
    ? chatLink(title, chat.username)
    : text(title)
}
