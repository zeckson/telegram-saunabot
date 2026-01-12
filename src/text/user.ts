import { fmt, FormattedString, mentionUser } from "../deps.ts"
import { User } from '../type/user.type.ts'

const UNKNOWN = fmt`<неизвестен>`
export const info = (user?: User): FormattedString =>
	fmt`${user?.identity ?? UNKNOWN}`
export const mention = (user?: User) =>
	user ? mentionUser(info(user), user.id) : info(user)
