import { Context } from "./deps.ts"
import { UserStatus } from "./type/user-status.ts"

export interface UserContext extends Context {
  user: { id: number , username?: string, fullName: string, status: UserStatus }
}
