import { NextFunction } from '../deps.ts'
import { User, UserContext } from '../type/user.type.ts'
import { UserStore } from '../store/user-store.ts'

const EMPTY_USER = new User({
	id: -1,
	first_name: `<unknown user>`,
	is_bot: false,
})

const store = await UserStore.open()

export const context = async (ctx: UserContext, next: NextFunction) => {
	const from = ctx.from
	if (!from) {
		const updateId = ctx.update.update_id
		const types = Object.keys(ctx.update).filter((it) => it !== `update_id`)

		console.error(
			`Update[${updateId}] no user context. Types: ${types.join(`,`)}`,
		)

		ctx.user = EMPTY_USER
	} else {
    const user = from
    await store.saveOrUpdate(user)
    ctx.user = new User(user)
	}

	return next()
}
