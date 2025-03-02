import { Chat, GrammyError } from '../deps.ts'
import { User } from '../type/user.type.ts'
import { DenoStore } from './denostore.ts'

export class AccessStore {
	constructor(private readonly store: DenoStore) {
	}

	async request(user: User, chat: Chat): Promise<boolean> {
		return await this.store.save(
			[`access`, `request`, user.id, `chat`, chat.id],
			chat,
		)
	}

	async approve(user: User, chat: Chat): Promise<boolean> {
		return await this.store.save(
			[`access`, `approve`, user.id, `chat`, chat.id],
			chat,
		)
	}

	async reject(user: User, chat: Chat): Promise<boolean> {
		return await this.store.save([
			`access`,
			`reject`,
			user.id,
			`chat`,
			chat.id,
		], chat)
	}

	async error(user: User, chat: Chat, error: GrammyError): Promise<boolean> {
		return await this.store.save([
			`access`,
			`error`,
			user.id,
			`chat`,
			chat.id,
		], error)
	}
}
