import { bold, fmt, FormattedString, link, mentionUser, } from './deps.ts'
import { Chat, ChatJoinRequest } from './deps.ts'
import { BanResult } from './action/ban.ts'
import { BotContext } from './type/context.ts'

const getChatLink = (chat: Chat) => {
  const title = chat.title ?? chat.type
  return chat.username
    ? link(title, `tg://resolve?domain=${chat.username}`)
    : title
}

export class Messages {
  static onJoinRequest(ctx: BotContext & ChatJoinRequest, banInfo: BanResult): FormattedString {
    const isBanned = banInfo.length > 0
    const user = ctx.user
    const chat = ctx.chat
    return fmt`Заявка #${ctx.update.update_id} ${
      isBanned ? bold(`🚫 Заблокирована!`) : ``
    }
Запрос на добавление пользователя ${
      mentionUser(user.identity, user.id)
    } в чат ${getChatLink(chat)}
Проверить пользователя можно по ${
      link(`ссылке`, `https://t.me/lolsbotcatcherbot?start=${user.id}`)
    }
Информация о бане пользовеля: ${bold(isBanned ? ` забанен:` : `неизвестна.`)}
    ${
      fmt([
        ...banInfo.map((it) =>
          fmt`- в базе данных ${it.name}: ${link(`детали`, it.url)}\n`
        ),
      ])
    }`
  }
}
