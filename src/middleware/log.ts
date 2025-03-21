import { NextFunction } from '../deps.ts'
import { UserContext } from '../type/user.type.ts'

const logUpdate = (ctx: UserContext) => {
	const updateId = ctx.update.update_id
	const type = ctx.type

	console.log(
		`Got update[${updateId}] from ${ctx.user.identity} with types: ${type}`,
	)

	const separator = `====== update[${updateId}] =======`
	console.log(separator)
	console.dir(ctx.update)
	console.log(separator)
}

export const log = async (ctx: UserContext, next: NextFunction) => {
	// take time before
	const before = Date.now() // milliseconds

	logUpdate(ctx)

	// invoke downstream middleware
	try {
		await next() // make sure to `await`!
	} finally {
		// take time after
		// log difference
		console.log(
			`Response time update[${ctx.update.update_id}]: ${
				Date.now() - before
			} ms`,
		)
	}
}
