import { fmt, FormattedString, link, mentionUser } from "../deps.ts"
import { User } from '../type/user.type.ts'

const UNKNOWN = fmt`<неизвестен>`
const info = (user?: User): FormattedString =>
	fmt`${user?.identity ?? UNKNOWN}`
export const userLink = (user?: User) =>
	user ? mentionUser(info(user), user.id) : info(user)

export const verifyLink = (id: number | string, name: string = `ссылке`) => link(
  name,
  `https://t.me/lolsbotcatcherbot?start=${id}`,
)

