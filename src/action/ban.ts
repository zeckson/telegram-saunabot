import { bold, FormattedString, link, mentionUser } from "../deps.ts"
import { ChatJoinRequest, fmt } from "../deps.ts"
import { BotContext } from '../type/context.ts'
import { User } from "../type/user.type.ts"
import { fetchJson } from '../util/fetch.ts'
import { declineUserJoinRequest } from "./admin.ts"

type DataType = { banned: boolean; ok: boolean; result: [object] | undefined }

type BanResult = {name: string, url: string}[]

const CAS = {
  api: `https://api.cas.chat/check?user_id=`,
  info: `https://cas.chat/query?u=`,
}

const LOLS = {
  api: `https://api.lols.bot/account?id=`,
  info: `https://lols.bot/?u=`,
}

  const DEFAULT_TIMEOUT = 1000

export const getBanInfo = async (
  id: number,
): Promise<BanResult> => {
  const promises = [
    CAS.api + id,
    LOLS.api + id,
  ].map((it) => fetchJson<DataType>(it, {}, DEFAULT_TIMEOUT).catch(() => undefined))
  const [cas_ban, lols_ban] = (await Promise.all(promises)).map((
    it: DataType | undefined,
  ) => (it && it.banned) || (it && it.ok && it.result !== undefined))

  const result: BanResult = [];
  if (cas_ban == true) {
    result.push({name: `CAS`, url: CAS.info + id})
  }
  if (lols_ban == true) {
    result.push({name: `LOLS`, url: LOLS.info + id})
  }

  return result
}

export const getUserBanStatus = ({ identity, id }: User, banInfo: BanResult): FormattedString =>
  fmt([
    `Пользователь: `, mentionUser(identity, id), bold(banInfo.length > 0 ? ` забанен:` : ` не забанен.`),
    ...banInfo.map((it) =>
      fmt`\`- в базе данных ${it.name}: ${link(`детали`, it.url)}\``),
  ])

export const checkUserIsBanned = async (ctx: BotContext & ChatJoinRequest) : Promise<boolean> => {
  const info = await getBanInfo(ctx.user.id)
  if (info.length > 0) {
    await declineUserJoinRequest(ctx, getUserBanStatus(ctx.user, info)) // TODO: fix message
    return true
  }
  return false
}
