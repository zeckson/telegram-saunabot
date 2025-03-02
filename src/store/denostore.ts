import KvEntry = Deno.KvEntry
import KvEntryMaybe = Deno.KvEntryMaybe
import KvKey = Deno.KvKey
import KvListSelector = Deno.KvListSelector

const DENO_KV_URL = Deno.env.get('DENO_KV_URL')

const openStore = () => {
	if (DENO_KV_URL) return Deno.openKv(DENO_KV_URL)
	else return Deno.openKv()
}

export class DenoStore {
	constructor(private db: Deno.Kv) {
	}

	async save<T>(
		key: KvKey,
		data: T,
		options?: { expireIn?: number },
	): Promise<boolean> {
		const result = await this.db.set(key, data, options)
		return result.ok
	}

	async load<T>(key: KvKey): Promise<T | undefined> {
		const value = await this.db.get<T>(key)
		return value.value == null ? undefined : value.value
	}

	async list(selector: KvListSelector): Promise<KvEntry<object>[]> {
		return await Array.fromAsync(this.db.list(selector))
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
