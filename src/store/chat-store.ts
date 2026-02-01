import { Chat } from '../deps.ts'
import { DenoStore } from './denostore.ts'

export class ChatStore {
	constructor(private readonly store: DenoStore) {
	}

	async saveOrUpdate(chat: Chat): Promise<boolean> {
		return await this.store.save([`chat`, chat.id], chat)
	}

	async delete(chatId: number): Promise<void> {
		return await this.store.delete([`chat`, chatId])
	}

	async getAll(): Promise<Chat[]> {
		const chats: Chat[] = []
		const iter = this.store.list<Chat>({ prefix: [`chat`] })
		for await (const entry of iter) {
			chats.push(entry.value)
		}
		return chats
	}
}
