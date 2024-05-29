import { User } from "https://deno.land/x/grammy_types@v3.4.6/manage.ts"
import { GroupContext } from "../context.ts"
import { NextFunction } from '../deps.ts'
import { UserStatus } from "../type/user-status.ts"

const TG_SERVICE_ACCOUNT_ID = 777000
const _TG_SERVICE_ACCOUNT: User = Object.freeze({
  "id": TG_SERVICE_ACCOUNT_ID,
  "is_bot": false,
  "first_name": "Telegram"
}) // Special tgService account which reposts messages from channel to group

const isNotEmpty = (strings: TemplateStringsArray, value: unknown) =>
  value ? `${strings[0]}${value}` : ``

const report = (message: string, ctx: GroupContext) => {
  // TODO: send user to chat admin or provide link

  return ctx.reply(message)
}

const setUserContext = (ctx: GroupContext, userID: number, from: User, status: UserStatus) => {
  ctx.user = {
    id: userID,
    username: from.username,
    fullName: `[${userID}${isNotEmpty`@${from.username}`}] ${from.first_name}${isNotEmpty` ${from.last_name}`}`,
    isAdmin: status == `administrator` || status == `creator`,
    status
  }
}


const getStatus = async (ctx: GroupContext, groupIdOrChannelId: string | number, userID: number) => {
  if (userID === TG_SERVICE_ACCOUNT_ID) {
    // Ignore service messages
    return 'service_bot'
  }

  const chatMember = await ctx.api.getChatMember(groupIdOrChannelId, userID)

  return chatMember.status
}

const isIgnored = (ctx: GroupContext) => {
  return !!(ctx.update.channel_post || ctx.update.edited_channel_post);
}


export const isInChannelPredicate = (groupIdOrChannelId: string | number) => {
  return async (ctx: GroupContext, next: NextFunction) => {
    const from = ctx.from
    if (!from) {
      if (isIgnored(ctx)) {
        return next()
      }
      console.warn(`Unknown userId`, ctx)
      return report(`User is unknown. Check logs.`, ctx)
    }

    const userID = from.id

    try {
      // Check if the user is a member of the group
      const status = await getStatus(ctx, groupIdOrChannelId, userID)

      console.debug(`User[${userID}] with status: ${status}`)


      setUserContext(ctx, userID, from, status)
      // Continue handling
      return next()
    } catch (error) {
      console.error('Error:', error)

      return report(`Failed to handle user with error: ${error.message}`, ctx)
    }
  }
}

