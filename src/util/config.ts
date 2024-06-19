import { requireEnv } from './environment.ts'
import { int } from './system.ts'

const adminids = requireEnv(`ADMIN_ID`).split(`,`).map(int)
export const Config = {
  TELEGRAM_TOKEN: requireEnv(`TELEGRAM_TOKEN`, true),
  ADMIN_IDS: adminids,
  ADMIN_ID: adminids[0],
}
