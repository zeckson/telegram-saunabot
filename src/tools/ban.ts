import { fetchJson } from '../util/fetch.ts'

export enum BanStatus {
	BANNED = `banned`,
	NOT_BANNED = `not_banned`,
	UNKNOWN = `unknown`, // failed to fetch ban status
}

type DataType = { banned: boolean; ok: boolean; result: [object] | undefined }

type BanInfo = { name: string; url: string }

export type BanCheckResult = {
	status: BanStatus
	info: BanInfo[]
}

export interface BanChecker {
	check(id: number, timeout: number): Promise<BanInfo | undefined>
}

const CAS: BanChecker = {
	check: async (id, timeout) => {
		const api = `https://api.cas.chat/check?user_id=${id}`
		const infoUrl = `https://cas.chat/query?u=${id}`

		const data = await fetchJson<DataType>(api, {}, timeout)
		if (data && data.ok && data.result !== undefined) {
			return { name: `CAS`, url: infoUrl }
		}

		return undefined
	},
}

const LOLS: BanChecker = {
	check: async (id, timeout) => {
		const api = `https://api.lols.bot/account?id=${id}`
		const infoUrl = `https://lols.bot/?u=${id}`

		const data = await fetchJson<DataType>(api, {}, timeout)
		if (data && data.banned) {
			return { name: `LOLS`, url: infoUrl }
		}

		return undefined
	},
}

const CHECKERS: BanChecker[] = [CAS, LOLS]

const DEFAULT_TIMEOUT = 5000

export const getBanInfo = async (
	id: number,
	timeout = DEFAULT_TIMEOUT,
): Promise<BanCheckResult> => {
	try {
		const results = await Promise.all(
			CHECKERS.map((c) => c.check(id, timeout)),
		)
		const info = results.filter((it): it is BanInfo => it !== undefined)

		return {
			status: info.length > 0 ? BanStatus.BANNED : BanStatus.NOT_BANNED,
			info,
		}
	} catch {
		return { status: BanStatus.UNKNOWN, info: [] }
	}
}
