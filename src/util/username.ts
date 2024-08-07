import { isNotEmpty, link } from './string.ts'

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

  const identity = `[${from.id}${isNotEmpty`@${from.username}`}]`
  const fullName = `${from.first_name}${isNotEmpty` ${from.last_name}`}`
  const isBot = from.is_bot ? `(bot)` : ``
  return `${identity} ${fullName} ${isBot}`
}

export const getUserLink = (from?: UserLike) =>
  !from ? `Unknown user` : link(getFullName(from), `tg://user?id=${from.id}`)
