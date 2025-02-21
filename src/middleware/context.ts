import { MiddlewareFn } from 'grammy'
import { DenoStore } from '../store/denostore.ts'
import { UserStore } from '../store/user-store.ts'
import { User, UserContext } from '../type/user.type.ts'

const EMPTY_USER = new User({
	id: -1,
	first_name: `<unknown user>`,
	is_bot: false,
})

const store = await DenoStore.get()
const userStore = new UserStore(store)

export const context: MiddlewareFn<UserContext> = async (ctx, next) => {
	const from = ctx.from
	const type = Object.keys(ctx.update)
		.find((it) => it !== `update_id`) ?? `unknown`

	if (!from) {
		const updateId = ctx.update.update_id

		console.error(
			`Update[${updateId}] no user context. Type: ${type}`,
		)

		ctx.user = EMPTY_USER
	} else {
		const user = from
		await userStore.saveOrUpdate(user)
		ctx.user = new User(user)
	}
	ctx.store = store
	ctx.type = type

	return next()
}
