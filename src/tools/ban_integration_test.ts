import { assert, assertEquals } from '@std/assert'
import { int } from "../util/system.ts"
import { BanStatus, getBanInfo } from './ban.ts'

const CAS_BANNED_ID = `7954858414`
const LOS_BANNED_ID = `8013457047`
const NOT_BANNED_ID = `5813219381`

Deno.test('getBanInfo integration tests', async (t) => {
	await t.step(
		`should fetch real data for ID ${LOS_BANNED_ID} (Banned on LOLS)`,
		async () => {
			const result = await getBanInfo(int(LOS_BANNED_ID))
			console.log(`Result for ID ${LOS_BANNED_ID}:`, result)

      assertEquals(result.status, BanStatus.BANNED)

			assert(
				result.info.some((r) => r.name === 'LOLS'),
				'Should be banned on LOLS',
			)
		},
	)

	await t.step(
		`should fetch real data for ID ${CAS_BANNED_ID} (Banned on CAS)`,
		async () => {
			const result = await getBanInfo(int(CAS_BANNED_ID))
			console.log(`Result for ID ${CAS_BANNED_ID}:`, result)

      assertEquals(result.status, BanStatus.BANNED)

			assert(
				result.info.some((r) => r.name === 'CAS'),
				'Should be banned on CAS',
			)
		},
	)

  await t.step(
    `should timeout`,
    async () => {
      const result = await getBanInfo(int(NOT_BANNED_ID), 0)

      assertEquals(result.status, BanStatus.UNKNOWN)

      assertEquals(result.info, [])
    },
  )

	await t.step('should return empty for a likely clean ID', async () => {
		// Using a very large ID that is unlikely to be banned
		const result = await getBanInfo(int(NOT_BANNED_ID))
		console.log(`Result for ID ${NOT_BANNED_ID}:`, result)

    assertEquals(result.status, BanStatus.NOT_BANNED)
		assertEquals(result.info, [])
	})
})
