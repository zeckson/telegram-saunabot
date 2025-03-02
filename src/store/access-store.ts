import { Chat } from "../deps.ts"
import { User } from "../type/user.type.ts"
import { DenoStore } from "./denostore.ts"

export class AccessStore {
  constructor(private readonly store: DenoStore) {
  }

  async request(user: User, chat: Chat): Promise<boolean> {
    return await this.store.save([`request`, user.id, `chat`, chat.id], chat)
  }

  async approve(user: User, chat: Chat): Promise<boolean> {
    return await this.store.save([`approve`, user.id, `chat`, chat.id], chat)
  }

  async reject(user: User, chat: Chat): Promise<boolean> {
    return await this.store.save([`reject`, user.id, `chat`, chat.id], chat)
  }

}
