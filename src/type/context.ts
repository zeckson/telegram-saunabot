import { Context } from "../deps.ts"
import { TranslateFlavor } from "../middleware/translate.type.ts"
import { UserStatus } from './user-status.ts'

export interface UserContext extends Context {
  user: { id: number; username?: string; fullName: string; status: UserStatus }
}

export type BotContext = TranslateFlavor<UserContext>
