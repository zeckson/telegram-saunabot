import { ParseModeFlavor } from "../deps.ts"
import { UserContext } from './user.type.ts'

export type BotContext = ParseModeFlavor<UserContext>
