import { BanCheckResult } from '../../tools/ban.ts'
import type { ChatJoinRequest } from '../../deps.ts'
import type { BotContext } from '../../type/context.ts'

export type JoinFlowContext = BotContext & ChatJoinRequest & {
	banStatus?: BanCheckResult
}
