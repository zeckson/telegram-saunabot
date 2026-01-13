const openStore = () => {
	const DENO_KV_URL = Deno.env.get('DENO_KV_URL')

	if (DENO_KV_URL) return Deno.openKv(DENO_KV_URL)
	else return Deno.openKv()
}

export class DenoStore {
	constructor(private db: Deno.Kv) {
	}

	async save<T>(
		key: Deno.KvKey,
		data: T,
		options?: { expireIn?: number },
	): Promise<boolean> {
		const result = await this.db.set(key, data, options)
		return result.ok
	}

	async load<T>(key: Deno.KvKey): Promise<T | undefined> {
		const value = await this.db.get<T>(key)
		return value.value == null ? undefined : value.value
	}

	close() {
		this.db.close()
	}

	private static instance: DenoStore | null = null

	static async get(): Promise<DenoStore> {
		if (!DenoStore.instance) {
			DenoStore.instance = new DenoStore(await openStore())
		}

		return DenoStore.instance
	}
}
