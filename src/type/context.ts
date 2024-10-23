import { TranslateFlavor } from './translate.type.ts'
import { UserContext } from './user.type.ts'

export type BotContext = TranslateFlavor<UserContext>
