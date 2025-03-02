import { ApiError } from 'grammy/types'
import { NextFunction } from '../deps.ts'
import { ErrorStore } from '../store/error-store.ts'
import { UserContext } from '../type/user.type.ts'

export const error = async (ctx: UserContext, next: NextFunction) => {
	// invoke downstream middleware
	try {
		await next() // make sure to `await`!
	} catch (e) {
		const store = new ErrorStore(ctx.store)
		console.error(`Got error: ${e}`, e)
		await store.save(ctx, e as ApiError)
		if (ctx.user.is_admin) {
			await ctx.reply(String(e))
		}
	}
}
