import { GrammyError } from "../deps.ts"
import { blockquote, bold, } from '../deps.ts'
import { ChatJoinRequest, fmt, FormattedString, link, mentionUser, } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { getFormattedChatLink } from "../util/link.ts"
import { JoinRequestAction } from "./admin.ts"
import { BanResult } from "./ban.ts"

enum Status {
  UNKNOWN = `неизвестно.`,
  BANNED = `banned`,
  NOT_BANNED = `в базах не упоминается`,
}

const hashtag = (value: string | number) => `#${value}`

export class Messages {
  static chatJoinAction(action: JoinRequestAction): string {
    switch (action) {
      case JoinRequestAction.APPROVE:
        return `Добавлен в группу`
      case JoinRequestAction.DECLINE:
        return `Отклонён`
      default:
        return `Неизвестная команда`
    }
  }
  static notifyError(ctx: BotContext, id: string, e: GrammyError): string | FormattedString {
    return fmt`Не удалось принять/отклонить заявку ${hashtag(id)}
Запрос от ${mentionUser(ctx.user.identity, ctx.user.id)}. Текст ошибки:
  ${e.message}`
  }
  static notifyJoinRejected(ctx: BotContext, id: string): FormattedString {
    return fmt`Заявка ${hashtag(id)} отклонена ${mentionUser(ctx.user.identity, ctx.user.id)}`
  }
  static notifyJoinApproved(ctx: BotContext, id: string): FormattedString {
    return fmt`Заявка #${hashtag(id)} принята ${mentionUser(ctx.user.identity, ctx.user.id)}`
  }
  static approveButtonText = `👍 Подтвердить`
  static declineButtonText = `👎 Отклонить`
  static chatJoinContactReceivedAdminNotification(
    ctx: BotContext,
    phone: string,
  ): FormattedString {
    const from = ctx.user

    const userLink = mentionUser(from.identity, from.id)
    const verifyLink = link(
      `ссылке`,
      `https://t.me/lolsbotcatcherbot?start=${from.id}`,
    )

    return fmt`Пользователь ${userLink} прислал свои контактные данные:
${blockquote(phone)}
Проверить пользователя можно по ${verifyLink}`
  }

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
    return fmt`Заявка ${hashtag(ctx.update.update_id)} ${
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


