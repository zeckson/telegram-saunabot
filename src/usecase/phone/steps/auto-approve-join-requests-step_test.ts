import { assertEquals, assert } from '@std/assert'
import { GrammyError } from 'grammy'
import { Chat } from 'grammy/types'
import { DenoStore } from '../../../store/denostore.ts'
import { AccessStore } from '../../../store/access-store.ts'
import { User } from '../../../type/user.type.ts'
import { PhoneFlowContext } from '../phone-context.ts'
import { autoApproveJoinRequestsStep } from './auto-approve-join-requests-step.ts'

Deno.env.set('ADMIN_ID', 'test')
Deno.env.set('TELEGRAM_TOKEN', 'test')

Deno.test({
	name: 'autoApproveJoinRequestsStep tests',
	sanitizeResources: false,
	async fn(t) {
		const kv = await Deno.openKv(':memory:')
		const denoStore = new DenoStore(kv)
		const accessStore = new AccessStore(denoStore)

		const mockUser = new User({
			id: 1,
			first_name: 'Test',
			is_bot: false,
		} as any)

		const mockChat: Chat = {
			id: 123,
			type: 'group',
			title: 'Test Group',
		}

    const ok = async () => {}

		await t.step('should do nothing when there are no pending requests', async () => {
			const approveCalls: any[] = []
			const ctx = {
				user: mockUser,
				store: denoStore,
				api: {
					approveChatJoinRequest: async (chatId: number, userId: number) => {
						approveCalls.push({ chatId, userId })
					},
				},
			} as unknown as PhoneFlowContext

			const result = await autoApproveJoinRequestsStep(ctx)

			assertEquals(result.ok, true)
			assertEquals(approveCalls.length, 0)
			assertEquals(ctx.approvedChats, undefined)
		})

		await t.step('should approve pending requests', async () => {
			await accessStore.request(mockUser, mockChat)

			const approveCalls: any[] = []

      const ctx = {
				user: mockUser,
				store: denoStore,
				api: {
					approveChatJoinRequest: async (chatId: number, userId: number) => {
						approveCalls.push({ chatId, userId })
					},
          sendMessage: ok,
				},
			} as unknown as PhoneFlowContext

			const result = await autoApproveJoinRequestsStep(ctx)

			assertEquals(result.ok, true)
			assertEquals(approveCalls.length, 1)
			assertEquals(approveCalls[0], { chatId: 123, userId: 1 })
			assertEquals(ctx.approvedChats, [mockChat])

			// Verify store states
			const pending = await accessStore.listPendingRequests(1)
			assertEquals(pending.length, 0)

			// Verify it was approved in store (key: access, approve, 1, chat, 123)
			const approved = await denoStore.load(['access', 'approve', 1, 'chat', 123])
			assertEquals(approved, mockChat)
		})

		await t.step('should handle GrammyError during approval', async () => {
			await accessStore.request(mockUser, mockChat)

			const grammyError = new GrammyError('Not authorized', {
				ok: false,
				error_code: 403,
				description: 'Forbidden',
			} as any, 'approveChatJoinRequest', {})

			const ctx = {
				user: mockUser,
				store: denoStore,
				api: {
					approveChatJoinRequest: async () => {
						throw grammyError
					},
          sendMessage: ok,
				},
			} as unknown as PhoneFlowContext

			const result = await autoApproveJoinRequestsStep(ctx)

			assertEquals(result.ok, true)
			assertEquals(ctx.approvedChats, undefined)

			// Verify error was saved in store
			const errorData = await denoStore.load(['access', 'error', 1, 'chat', 123])
			assert(errorData !== undefined)
			assertEquals((errorData as any).error_code, 403)

			// Pending requests should be cleared anyway
			const pending = await accessStore.listPendingRequests(1)
			assertEquals(pending.length, 0)
		})

		await t.step('should process multiple requests, some with errors', async () => {
			const mockChat2: Chat = { id: 456, type: 'group', title: 'Test Group 2' }
			await accessStore.request(mockUser, mockChat)
			await accessStore.request(mockUser, mockChat2)

			const approveCalls: number[] = []
			const ctx = {
				user: mockUser,
				store: denoStore,
				api: {
					approveChatJoinRequest: async (chatId: number) => {
						if (chatId === 123) {
							throw new GrammyError('Failed 123', { ok: false, error_code: 400, description: 'Bad Request' } as any, 'approveChatJoinRequest', {})
						}
						approveCalls.push(chatId)
					},
          sendMessage: ok,
				},
			} as unknown as PhoneFlowContext

			const result = await autoApproveJoinRequestsStep(ctx)

			assertEquals(result.ok, true)
			assertEquals(approveCalls, [456])
			assertEquals(ctx.approvedChats, [mockChat2])

			// Error for 123 should be in store
			const errorData = await denoStore.load(['access', 'error', 1, 'chat', 123])
			assert(errorData !== undefined)
			assertEquals((errorData as any).error_code, 400)

			// Approval for 456 should be in store
			const approved = await denoStore.load(['access', 'approve', 1, 'chat', 456])
			assertEquals(approved, mockChat2)

			// Pending requests should be cleared
			const pending = await accessStore.listPendingRequests(1)
			assertEquals(pending.length, 0)
		})

		kv.close()
	},
})
