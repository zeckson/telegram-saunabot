import { assertEquals } from '@std/assert'
import { BanStatus, getBanInfo } from './ban.ts'

const originalFetch = globalThis.fetch

type MockResponse = {
	body?: object | string
	status?: number
	error?: Error
}

const setupMockFetch = (handlers: Record<string, MockResponse>) => {
	globalThis.fetch = (url: string | URL | Request) => {
		const urlStr = url.toString()
		const entry = Object.entries(handlers).find(([key]) => urlStr.includes(key))

		if (entry) {
			const [_, mock] = entry
			if (mock.error) {
				return Promise.reject(mock.error)
			}
			const body = typeof mock.body === 'string'
				? mock.body
				: JSON.stringify(mock.body ?? {})
			return Promise.resolve(
				new Response(body, { status: mock.status ?? 200 }),
			)
		}

		return Promise.resolve(
			new Response(
				JSON.stringify({ ok: false, description: 'Record not found.' }),
				{ status: 200 },
			),
		)
	}
}

const mockNotBanned = () =>
	setupMockFetch({
		'api.lols.bot': { body: { ok: true, user_id: 123, banned: false } },
		'cas.chat': { body: { ok: false, description: 'Record not found.' } },
	})

const mockCasBanned = () =>
	setupMockFetch({
		'api.lols.bot': { body: { ok: true, user_id: 123, banned: false } },
		'cas.chat': {
			body: {
				ok: true,
				result: {
					reasons: [1],
					offenses: 1,
					messages: ['🚨В Telegram появился новый бот,...'],
					time_added: '2026-01-16T03:44:31.000Z',
				},
			},
		},
	})

const mockLolsBanned = () =>
	setupMockFetch({
		'api.lols.bot': {
			body: {
				ok: true,
				user_id: 8013457047,
				banned: true,
				when: '2025-11-26 01:00:20 UTC',
				offenses: 1,
				spam_factor: 7.14,
			},
		},
		'cas.chat': { body: { ok: false, description: 'Record not found.' } },
	})

Deno.test('getBanInfo tests', async (t) => {
	await t.step('should return CAS info when banned on CAS', async () => {
		mockCasBanned()
		const result = await getBanInfo(123)
		assertEquals(result.info, [{
			name: 'CAS',
			url: 'https://cas.chat/query?u=123',
		}])
	})

	await t.step(
		'should return LOLS info when banned on LOLS (banned: true)',
		async () => {
			mockLolsBanned()

			const result = await getBanInfo(456)
			assertEquals(result.info, [{
				name: 'LOLS',
				url: 'https://lols.bot/?u=456',
			}])
		},
	)

	await t.step('should return both when banned on both', async () => {
		setupMockFetch({
			'api.lols.bot': { body: { banned: true, ok: true } },
			'cas.chat': { body: { ok: true, result: [{}] } },
		})

		const result = await getBanInfo(789)
		assertEquals(result.info, [
			{ name: 'CAS', url: 'https://cas.chat/query?u=789' },
			{ name: 'LOLS', url: 'https://lols.bot/?u=789' },
		])
	})

	await t.step('should return empty when not banned', async () => {
		mockNotBanned()

		const result = await getBanInfo(0)
		assertEquals(result.info, [])
	})

	await t.step('should handle partial fetch errors', async () => {
		setupMockFetch({
			'cas.chat': { error: new Error('Network error') },
			'api.lols.bot': { body: { ok: true, user_id: 123, banned: true } },
		})

		const result = await getBanInfo(123)
		assertEquals(result.status, BanStatus.UNKNOWN)
		assertEquals(result.info, [])
	})

	await t.step('should handle fetch errors gracefully', async () => {
		globalThis.fetch = () => Promise.reject(new Error('Network error'))

		const result = await getBanInfo(123)
		assertEquals(result.status, BanStatus.UNKNOWN)
		assertEquals(result.info, [])
	})

	await t.step('should handle non-ok responses', async () => {
		setupMockFetch({
			'cas.chat': { body: 'Internal Server Error', status: 500 },
			'api.lols.bot': { body: 'Internal Server Error', status: 500 },
		})

		const result = await getBanInfo(123)
		assertEquals(result.info, [])
	})

	await t.step('should handle timeouts', async () => {
		const timeoutError = new Error('Request timed out')
		timeoutError.name = 'AbortError'
		globalThis.fetch = () => Promise.reject(timeoutError)

		const result = await getBanInfo(123)
    assertEquals(result.status, BanStatus.UNKNOWN)
		assertEquals(result.info, [])
	})

	// Restore original fetch
	globalThis.fetch = originalFetch
})
