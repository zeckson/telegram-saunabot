import { BanResult } from './action/ban.ts'
import { bold, ChatJoinRequest, fmt, FormattedString, link, mentionUser } from './deps.ts'
import { BotContext } from './type/context.ts'
import { getFormattedChatLink } from "./util/link.ts"

enum Status {
  UNKNOWN = `неизвестно.`,
  BANNED = `banned`,
  NOT_BANNED = `в базах не упоминается`,
}

export class Messages {
  static onJoinRequest(
    ctx: BotContext & ChatJoinRequest,
    banInfo: BanResult | undefined = undefined,
  ): FormattedString {
    let status: Status = Status.UNKNOWN
    if (banInfo) {
      if (banInfo.length > 0) {
        status = Status.BANNED
      } else if (banInfo.length == 0) {
        status = Status.NOT_BANNED
      }
    } else {
      banInfo = []
    }

    const user = ctx.user
    const chat = ctx.chat
    return fmt`Заявка #${ctx.update.update_id} ${
      status == Status.BANNED ? bold(`🚫 Заблокирована!`) : ``
    }
Запрос на добавление пользователя ${
      mentionUser(user.identity, user.id)
    } в чат ${getFormattedChatLink(chat)}
Проверить пользователя можно по ${
      link(`ссылке`, `https://t.me/lolsbotcatcherbot?start=${user.id}`)
    }
Информация о бане пользовеля: ${bold(status)}
    ${
      fmt([
        ...(banInfo.map((it) =>
          fmt`- в базе данных ${it.name}: ${link(`детали`, it.url)}\n`
        )),
      ])
    }`
  }
}
