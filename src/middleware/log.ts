import { Context, NextFunction } from '../deps.ts'
import { getUsername } from '../util/username.ts'

const logUpdate = (ctx: Context) => {
  const updateId = ctx.update.update_id
  const updateTypes = Object.keys(ctx.update).filter((it) => it !== `update_id`)

  console.log(
    `Got update[${updateId}] from ${getUsername(ctx.from)} with types: ${
      updateTypes.join(`,`)
    }`,
  )

  const message = ctx.msg
  if (message) {
    const separator = `====== message[${message.message_id}] =======`
    console.log(separator)
    console.dir(message)
    console.log(separator)
  }
}

export const log = async (ctx: Context, next: NextFunction) => {
  // take time before
  const before = Date.now() // milliseconds

  logUpdate(ctx)

  // invoke downstream middleware
  try {
    await next() // make sure to `await`!
  } catch (e) {
    console.error(`Got error: ${e}`, e)
  } finally {
    // take time after
    // log difference
    console.log(
      `Response time update[${ctx.update.update_id}]: ${
        Date.now() - before
      } ms`,
    )
  }
}
