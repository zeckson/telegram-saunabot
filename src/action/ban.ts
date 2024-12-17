import { ChatJoinRequest } from 'https://deno.land/x/grammy_types@v3.11.0/manage.ts'
import { BotContext } from '../type/context.ts'
import { fetchJson } from '../util/fetch.ts'
import { declineUserJoinRequest } from "./admin.ts"

type DataType = { banned: boolean; ok: boolean; result: [object] | undefined }

type BanResult = {
  cas: string | undefined
  lols: string | undefined
  banned: boolean
}

const CAS = {
  api: `https://api.cas.chat/check?user_id=`,
  info: `https://cas.chat/query?u=`,
}

const LOLS = {
  api: `https://api.lols.bot/account?id=`,
  info: `https://lols.bot/?u=`,
}

const getBanInfo = async (
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
  return {
    cas: cas ? (CAS.info + id) : undefined,
    lols: lols ? (LOLS.info + id) : undefined,
    banned: cas || lols,
  }
}

export const checkUserIsBanned = async (ctx: BotContext & ChatJoinRequest) : Promise<boolean> => {
  const info = await getBanInfo(ctx.user.id)
  if (info.banned) {
    await declineUserJoinRequest(ctx, `Пользователю отказано в доступе`) // TODO: fix message
    return true
  }
  return false
}
