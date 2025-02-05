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

	async save(key: KvKey, data: object): Promise<boolean> {
		const result = await this.db.set(key, data)
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

	static async create(): Promise<DenoStore> {
		return new DenoStore(await openStore())
	}
}
