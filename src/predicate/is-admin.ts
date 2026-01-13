import { UserContext } from '../type/user.type.ts'
import { Config } from '../util/config.ts'

const adminSet = new Set<number>(Config.ADMIN_IDS)

export const isAdmin = (ctx: UserContext) => adminSet.has(ctx.user.id)

export const isAdminMiddleware = (
	ctx: UserContext,
	next: () => Promise<void>,
) => {
	if (isAdmin(ctx)) {
		return next()
	}
	console.error(`User is not admin: ${ctx.user.identity}`)
}
