import { User } from '../deps.ts'
import { DenoStore } from './denostore.ts'

export class UserStore {
	constructor(private readonly store: DenoStore) {
	}

	async saveOrUpdate(user: User): Promise<boolean> {
		return await this.store.save([`user`, user.id], user)
	}

	async savePhone(userId: number, phone: string): Promise<boolean> {
		return await this.store.save([`user`, userId, `phone`, phone], phone)
	}

	async getById(id: string): Promise<User | undefined> {
		return await this.store.load<User>([`user`, id])
	}
}
