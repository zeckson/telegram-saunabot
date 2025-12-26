import {
	blockquote,
	bold,
	ChatJoinRequest,
	fmt,
	FormattedString,
	GrammyError,
	link,
	mentionUser,
} from '../deps.ts'
import { BotContext } from '../type/context.ts'
import hashtag from "../util/hashtag.ts"
import { getFormattedChatLink } from '../util/link.ts'
import { JoinRequestAction } from './admin.ts'
import { BanResult } from './ban.ts'

enum Status {
	UNKNOWN = `неизвестно.`,
	BANNED = `banned`,
	NOT_BANNED = `в базах не упоминается`,
}

export class Messages {
	static requestContactError(
		ctx: BotContext,
		e: GrammyError,
	): FormattedString {
		const user = ctx.user
		const id = ctx.update.update_id
		return fmt`Не удалось отправись запрос пользователю ${hashtag(id)}
Запрос от ${mentionUser(user.identity, user.id)}. Текст ошибки:
  ${e.message}`
	}
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
  static getMessageByError(e: GrammyError): string {
    switch (e.error_code) {
      case 400:
        return `Ошибка 400: ${e.description}`
      case 403:
        return `Пользователь деактивирован`
      default:
        return e.message
    }
  }
	static notifyError(
		ctx: BotContext,
		userId: number,
		e: GrammyError,
	): string | FormattedString {
		return fmt`Не удалось принять/отклонить заявку ${hashtag(userId)}
Запрос от ${mentionUser(ctx.user.identity, ctx.user.id)}. Текст ошибки:
  ${this.getMessageByError(e)}`
	}
	static notifyJoinRejected(
		ctx: BotContext,
		userId: number,
	): FormattedString {
		return fmt`Заявка ${hashtag(userId)} отклонена ${
			mentionUser(ctx.user.identity, ctx.user.id)
		}`
	}
	static notifyJoinApproved(
		ctx: BotContext,
		userId: number,
	): FormattedString {
		return fmt`Заявка ${hashtag(userId)} принята ${
			mentionUser(ctx.user.identity, ctx.user.id)
		}`
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

		return fmt`Заявка ${hashtag(from.id)}
Пользователь ${userLink} прислал свои контактные данные:
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
		return fmt`Заявка ${hashtag(user.id)} ${
			status == Status.BANNED ? bold(`🚫 Заблокирована!`) : ``
		}
Запрос на добавление пользователя ${
			mentionUser(user.identity, user.id)
		} в чат ${getFormattedChatLink(chat)}
Проверить пользователя можно по ${
			link(`ссылке`, `https://t.me/lolsbotcatcherbot?start=${user.id}`)
		}
Информация о бане пользователя: ${bold(status)}
    ${
			fmt([
				...(banInfo.map((it) =>
					fmt`- в базе данных ${it.name}: ${link(`детали`, it.url)}\n`
				)),
			])
		}`
	}
}
