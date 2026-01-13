import { BanResult } from "../../action/ban.ts"
import type { ChatJoinRequest } from '../../deps.ts'
import type { BotContext } from '../../type/context.ts'

export enum BanStatus {
  BANNED = `banned`,
  NOT_BANNED = `not_banned`,
  UNKNOWN = `unknown`, // failed to fetch ban status
}

export type BanData = {
  status: BanStatus,
  info: BanResult
}

export type JoinFlowContext = BotContext & ChatJoinRequest & {
  banStatus?: BanData
}
