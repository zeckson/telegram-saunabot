import { Context, NextFunction } from '../deps.ts'

const isAllowed = (
  status:
    | 'member'
    | 'creator'
    | 'administrator'
    | 'restricted'
    | 'left'
    | 'kicked',
) => {
  switch (status) {
    case 'member':
    case 'administrator':
    case 'creator':
    case 'restricted':
      return true
    default:
      return false
  }
}

export const isInChat = (groupId: string | number) => {
  return async (ctx: Context, next: NextFunction) => {
    const userID = ctx.from?.id

    if (!userID) {
      console.warn(`Unknown userId`, ctx)
      return ctx.reply('User is not in the group.')
    }
    try {
      // Check if the user is a member of the group
      const chatMember = await ctx.api.getChatMember(groupId, userID)

      const status = chatMember.status
      const allowed = isAllowed(status)
      if (!allowed) {
        console.log(`User is not allowed with status: ${status}`)

        // TODO: send user to chat admin or provide link

        return ctx.reply(`User is not allowed with status: ${status}`)
      }
      // Continue handling
      return next()
    } catch (error) {
      console.error('Error:', error)
    }
    // Handle errors
    return ctx.reply('User is not in the group or not allowed!')
  }
}
