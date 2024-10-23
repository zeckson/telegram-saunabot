import { Context, User as GrammyUser } from '../deps.ts'
import { emojis } from '../util/emoji.ts'

const isNotEmpty = (strings: TemplateStringsArray, value: unknown) =>
  value ? `${strings[0]}${value}` : ``

interface UserLike {
  get id(): number
  /** True, if this user is a bot */
  get is_bot(): boolean
  /** User's or bot's first name */
  get first_name(): string
  /** User's or bot's last name */
  get last_name(): string | undefined
  /** User's or bot's username @nickname */
  get username(): string | undefined
  /** IETF language tag of the user's language */
  get language_code(): string | undefined
  /** True, if this user is a Telegram Premium user */
  get is_premium(): boolean
  /** True, if this user added the bot to the attachment menu */
  get added_to_attachment_menu(): boolean
}

export class User implements UserLike {
  constructor(private readonly user: GrammyUser) {
  }

  get id(): number {
    return this.user.id
  }

  get username(): string | undefined {
    return this.user.username
  }

  get first_name(): string {
    return this.user.first_name
  }

  get last_name(): string | undefined {
    return this.user.last_name
  }

  get is_bot(): boolean {
    return this.user.is_bot
  }

  get is_premium(): boolean {
    return this.user.is_premium ?? false
  }

  get language_code(): string | undefined {
    return this.user.language_code
  }

  get added_to_attachment_menu(): boolean {
    return this.user.added_to_attachment_menu ?? false
  }

  // User full identity `[id@username] firstName secondName`
  get identity() {
    const identity = [
      `[${this.id}${isNotEmpty`@${this.username}`}]`,
      this.fullName,
    ]

    this.is_bot ? identity.push(emojis.robot) : ``
    this.is_premium ? identity.push(emojis.premium) : ``

    return identity.join(` `)
  }

  get fullName() {
    return `${this.first_name}${isNotEmpty` ${this.last_name}`}`
  }

  get nickname() {
    return this.username ? `@${this.username}` : `<hidden>`
  }
}

export interface UserContext extends Context {
  user: User
}
