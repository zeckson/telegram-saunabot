import { assertEquals } from '@std/assert'
import { getBanInfo } from './ban.ts'

const originalFetch = globalThis.fetch

const notBanned = () => {
	globalThis.fetch = (url: string | URL | Request) => {
		if (url.toString().includes('api.lols.bot')) {
			return Promise.resolve(
				new Response(
					JSON.stringify({ ok: true, user_id: 123, banned: false }),
					{ status: 200 },
				),
			)
		}
		return Promise.resolve(
			new Response(
				JSON.stringify({ ok: false, description: `Record not found.` }),
				{ status: 200 },
			),
		)
	}
}

const casBanned = () => {
	globalThis.fetch = (url: string | URL | Request) => {
		if (url.toString().includes('api.lols.bot')) {
			return Promise.resolve(
				new Response(
					JSON.stringify({ ok: true, user_id: 123, banned: false }),
					{ status: 200 },
				),
			)
		}
		return Promise.resolve(
			new Response(
				JSON.stringify({
					ok: true,
					'result': {
						'reasons': [1],
						'offenses': 1,
						'messages': [
							'🚨В Telegram появился новый бот,...',
						],
						'time_added': '2026-01-16T03:44:31.000Z',
					},
				}),
				{ status: 200 },
			),
		)
	}
}

const lolsBanned = () => {
	globalThis.fetch = (url: string | URL | Request) => {
		if (url.toString().includes('api.lols.bot')) {
			return Promise.resolve(
				new Response(
					JSON.stringify({
						'ok': true,
						'user_id': 8013457047,
						'banned': true,
						'when': '2025-11-26 01:00:20 UTC',
						'offenses': 1,
						'spam_factor': 7.14,
					}),
					{ status: 200 },
				),
			)
		}
		return Promise.resolve(
			new Response(
				JSON.stringify({ ok: false, description: `Record not found.` }),
				{ status: 200 },
			),
		)
	}
}

Deno.test('getBanInfo tests', async (t) => {
	await t.step('should return CAS info when banned on CAS', async () => {
		casBanned()
		const result = await getBanInfo(123)
		assertEquals(result.info, [{
			name: 'CAS',
			url: 'https://cas.chat/query?u=123',
		}])
	})

	await t.step(
		'should return LOLS info when banned on LOLS (banned: true)',
		async () => {

      lolsBanned()

			const result = await getBanInfo(456)
			assertEquals(result.info, [{
				name: 'LOLS',
				url: 'https://lols.bot/?u=456',
			}])
		},
	)

	await t.step(
		'should return LOLS info when banned on LOLS (ok: true and result present)',
		async () => {

      lolsBanned()

			const result = await getBanInfo(456)
			assertEquals(result.info, [{
				name: 'LOLS',
				url: 'https://lols.bot/?u=456',
			}])
		},
	)

	await t.step('should return both when banned on both', async () => {
		globalThis.fetch = (url: string | URL | Request) => {
			return Promise.resolve(
				new Response(
					JSON.stringify({ banned: true, ok: true, result: [{}] }),
					{ status: 200 },
				),
			)
		}

		const result = await getBanInfo(789)
		assertEquals(result.info, [
			{ name: 'CAS', url: 'https://cas.chat/query?u=789' },
			{ name: 'LOLS', url: 'https://lols.bot/?u=789' },
		])
	})

	await t.step('should return empty when not banned', async () => {
		notBanned()

		const result = await getBanInfo(0)
		assertEquals(result.info, [])
	})

	await t.step('should handle fetch errors gracefully', async () => {
		globalThis.fetch = () => {
			return Promise.reject(new Error('Network error'))
		}

		const result = await getBanInfo(123)
		assertEquals(result.info, [])
	})

	await t.step('should handle non-ok responses', async () => {
		globalThis.fetch = () => {
			return Promise.resolve(
				new Response('Internal Server Error', { status: 500 }),
			)
		}

		const result = await getBanInfo(123)
		assertEquals(result.info, [])
	})

	await t.step('should handle timeouts', async () => {
		globalThis.fetch = () => {
			return new Promise((_, reject) => {
				const error = new Error('Request timed out')
				error.name = 'AbortError'
				reject(error)
			})
		}

		const result = await getBanInfo(123)
		assertEquals(result.info, [])
	})

	// Restore original fetch
	globalThis.fetch = originalFetch
})
