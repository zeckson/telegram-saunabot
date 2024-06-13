import { Bot, Context, I18nFlavor } from '../deps.ts'
import { UserStatus } from './user-status.ts'

export interface UserContext extends Context {
  user: { id: number; username?: string; fullName: string; status: UserStatus }
}

export type BotContext = UserContext & I18nFlavor
