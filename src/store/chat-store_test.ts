import { assert, assertEquals } from '@std/assert'
import { ChatStore } from './chat-store.ts'
import { DenoStore } from './denostore.ts'
import { Chat } from '../deps.ts'

Deno.test({
	name: 'ChatStore tests',
	sanitizeResources: false,
	async fn(t) {
		const kv = await Deno.openKv(':memory:')
		const denoStore = new DenoStore(kv)
		const chatStore = new ChatStore(denoStore)

		const mockChat: Chat = {
			id: 123,
			type: 'group',
			title: 'Test Group',
		}

		await t.step('saveOrUpdate should save chat', async () => {
			const ok = await chatStore.saveOrUpdate(mockChat)
			assert(ok)
			const chats = await chatStore.getAll()
			assertEquals(chats.length, 1)
			assertEquals(chats[0].id, 123)
		})

		await t.step('delete should remove chat', async () => {
			await chatStore.delete(123)
			const chats = await chatStore.getAll()
			assertEquals(chats.length, 0)
		})

		kv.close()
	},
})
