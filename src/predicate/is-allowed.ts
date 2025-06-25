import { ChatMember } from 'grammy/types'
import { UserStatus } from '../type/user-status.ts'
import { UserContext } from '../type/user.type.ts'

export const isAllowed: (status: UserStatus) => boolean = (
	status: UserStatus,
) => {
	switch (status) {
		case 'member':
		case 'administrator':
		case 'creator':
		case 'restricted':
		case 'service_bot':
			return true
		default:
			return false
	}
}

export const isAllowedMiddleware = async (
	ctx: UserContext,
	next: () => Promise<void>,
) => {
	const chatId = ctx.chat?.id
	if (!chatId) {
		return
	}
	const member: ChatMember = await ctx.api.getChatMember(
		chatId ?? `-1`,
		ctx.user.id,
	)
	if (!isAllowed(member.status)) {
		console.error(
			`User [${ctx.user.identity}] with status: ${member.status} is not allowed`,
		)
		return
	}
  return next()
}
