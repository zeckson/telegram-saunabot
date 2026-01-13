import { branch } from '../branch.ts'
import { failNotify } from '../fail-notify.ts'
import { pipeline } from '../pipeline.ts'
import { BanStatus, JoinFlowContext } from './join-context.ts'
import { fetchBanStatus } from './steps/fetch-ban-status.ts'
import { notifyAdminsJoinRequestStep } from './steps/notify-admins-join-request-step.ts'
import { rejectRequestIfBanned } from './steps/reject-request-if-banned.ts'
import { requestUserContactStep } from './steps/request-user-contact-step.ts'
import { saveRequestToStore } from './steps/save-request-to-store.ts'

const joinFlowPipeline = pipeline<JoinFlowContext>(`chat_join_request`, [
	fetchBanStatus,
	saveRequestToStore,
	notifyAdminsJoinRequestStep,
	branch<JoinFlowContext>(
		(ctx) => ctx.banStatus?.status === BanStatus.BANNED,
		[rejectRequestIfBanned],
		[],
	),
	requestUserContactStep,
])

export const handleChatJoinRequest = (ctx: JoinFlowContext) =>
	failNotify(joinFlowPipeline(ctx), ctx)
