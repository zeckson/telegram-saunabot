import { ChatJoinRequest } from 'https://deno.land/x/grammy_types@v3.11.0/manage.ts'
import { BotContext } from '../type/context.ts'
import { fetchJson } from '../util/fetch.ts'
import { declineUserJoinRequest } from './admin.ts'

type DataType = { banned: boolean; ok: boolean; result: [object] | undefined }

type BanResult = { cas: boolean; lols: boolean; banned: boolean }

const CAS = {
  api: `https://api.cas.chat/check?user_id=`,
  info: `https://api.cas.chat/check?user_id=`,
}

const LOLS = {
  api: `https://api.lols.bot/account?id=`,
  info: `https://api.lols.bot/account?id=`,
}

const isBanned = async (
  id: number,
): Promise<BanResult> => {
  const promises = [
    CAS.api + id,
    LOLS.api + id,
  ].map((it) => fetchJson<DataType>(it).catch(() => undefined))
  const [cas_ban, lols_ban] = (await Promise.all(promises)).map((
    it: DataType | undefined,
  ) => (it && it.banned) || (it && it.ok && it.result !== undefined))
  const cas = cas_ban == true
  const lols = lols_ban == true
  return { cas, lols, banned: cas || lols }
}

async function checkUserIsBanned(ctx: BotContext & ChatJoinRequest) {
  const user = ctx.user
  const { cas, lols } = await isBanned(ctx.user.id)
}
