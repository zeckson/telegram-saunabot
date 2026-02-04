import { assertEquals } from '@std/assert'
import { getBanInfo } from './ban.ts'

const originalFetch = globalThis.fetch

Deno.test('getBanInfo tests', async (t) => {
	await t.step('should return CAS info when banned on CAS', async () => {
		globalThis.fetch = (url: string | URL | Request) => {
			if (url.toString().includes('api.cas.chat')) {
				return Promise.resolve(new Response(JSON.stringify({ banned: true, ok: true }), { status: 200 }))
			}
			return Promise.resolve(new Response(JSON.stringify({ banned: false, ok: true }), { status: 200 }))
		}

		const result = await getBanInfo(123)
		assertEquals(result, [{ name: 'CAS', url: 'https://cas.chat/query?u=123' }])
	})

	await t.step('should return LOLS info when banned on LOLS (banned: true)', async () => {
		globalThis.fetch = (url: string | URL | Request) => {
			if (url.toString().includes('api.lols.bot')) {
				return Promise.resolve(new Response(JSON.stringify({ banned: true, ok: true }), { status: 200 }))
			}
			return Promise.resolve(new Response(JSON.stringify({ banned: false, ok: true }), { status: 200 }))
		}

		const result = await getBanInfo(456)
		assertEquals(result, [{ name: 'LOLS', url: 'https://lols.bot/?u=456' }])
	})

	await t.step('should return LOLS info when banned on LOLS (ok: true and result present)', async () => {
		globalThis.fetch = (url: string | URL | Request) => {
			if (url.toString().includes('api.lols.bot')) {
				return Promise.resolve(new Response(JSON.stringify({ ok: true, result: [{}] }), { status: 200 }))
			}
			return Promise.resolve(new Response(JSON.stringify({ banned: false, ok: true }), { status: 200 }))
		}

		const result = await getBanInfo(456)
		assertEquals(result, [{ name: 'LOLS', url: 'https://lols.bot/?u=456' }])
	})

	await t.step('should return both when banned on both', async () => {
		globalThis.fetch = (url: string | URL | Request) => {
			return Promise.resolve(new Response(JSON.stringify({ banned: true, ok: true, result: [{}] }), { status: 200 }))
		}

		const result = await getBanInfo(789)
		assertEquals(result, [
			{ name: 'CAS', url: 'https://cas.chat/query?u=789' },
			{ name: 'LOLS', url: 'https://lols.bot/?u=789' },
		])
	})

	await t.step('should return empty when not banned', async () => {
		globalThis.fetch = (url: string | URL | Request) => {
			return Promise.resolve(new Response(JSON.stringify({ banned: false, ok: true, result: undefined }), { status: 200 }))
		}

		const result = await getBanInfo(0)
		assertEquals(result, [])
	})

	await t.step('should handle fetch errors gracefully', async () => {
		globalThis.fetch = () => {
			return Promise.reject(new Error('Network error'))
		}

		const result = await getBanInfo(123)
		assertEquals(result, [])
	})

	await t.step('should handle non-ok responses', async () => {
		globalThis.fetch = () => {
			return Promise.resolve(new Response('Internal Server Error', { status: 500 }))
		}

		const result = await getBanInfo(123)
		assertEquals(result, [])
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
		assertEquals(result, [])
	})

	// Restore original fetch
	globalThis.fetch = originalFetch
})
