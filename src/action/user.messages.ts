import { bold, Chat, ChatJoinRequest, fmt, FormattedString, italic, link, } from '../deps.ts'
import { BotContext } from '../type/context.ts'
import { getFormattedChatLink } from '../util/link.ts'
import { text } from '../util/markdown.ts'

const privacyPolicy = `https://snezhdanov.ru/privacy-policy`

export class Messages {
  static shareContactButtonName = `Отправить контакт`

  static chatJoinVerifyMessage(
    ctx: BotContext & ChatJoinRequest,
  ): FormattedString {
    const from = ctx.user
    const chat: Chat = ctx.chat

    const fullName = text(from.fullName)
    const chatLink = getFormattedChatLink(chat)

    return fmt`Здравствуйте, ${bold(fullName)}!
    
Вы подали заявку на вступление в чат ${chatLink}.
В целях борьбы со спамом и спам-аккаунтами мы просим вас поделиться с нами вашими контактными данными.
Чтобы поделиться контактом нажмите кнопку ${bold(this.shareContactButtonName)}.
  
${
      italic(`Мы не храним и не предоставляем данные третьим лицам. 
Подробнее с политикой обработки персональных данных вы можете ознакомиться по `)
    }${link(`ссылке`, privacyPolicy)} 
    
${bold(`Благодарим за понимание!`)}
`
  }
}
