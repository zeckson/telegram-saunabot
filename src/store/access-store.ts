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

	async listPendingRequests(userId: number): Promise<Chat[]> {
		const prefix = [`access`, `request`, userId, `chat`]
		const entries = this.store.list<Chat>({ prefix })
		const chats: Chat[] = []
		for await (const entry of entries) {
			chats.push(entry.value)
		}
		return chats
	}

	async clearRequests(userId: number): Promise<void> {
		const prefix = [`access`, `request`, userId, `chat`]
		const entries = this.store.list<Chat>({ prefix })
		for await (const entry of entries) {
			await this.store.delete(entry.key)
		}
	}
}
