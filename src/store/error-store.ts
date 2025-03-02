import { ApiError } from 'grammy/types'
import { UserContext } from '../type/user.type.ts'
import { DenoStore } from './denostore.ts'

const THREE_DAYS = 3 * 24 * 60 * 60 * 1000 // 3 days in millis

export class ErrorStore {
	constructor(private readonly store: DenoStore) {
	}

	async save(ctx: UserContext, error: ApiError): Promise<boolean> {
		return await this.store.save([`error`, ctx.user.id, ctx.type, ctx.update.update_id], error, {
			expireIn: THREE_DAYS,
		})
	}
}
