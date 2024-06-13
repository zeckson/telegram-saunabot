import { requireEnv } from './environment.ts'
import { int } from './system.ts'

export const Config = {
  TELEGRAM_TOKEN: requireEnv(`TELEGRAM_TOKEN`, true),
  ADMIN_ID: int(requireEnv(`ADMIN_ID`)),
}
