import { Context } from "./deps.ts"

export interface GroupContext extends Context {
  user: { id: number, isAdmin: boolean }
}
