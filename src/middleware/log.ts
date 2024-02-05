import { Context, NextFunction } from '../deps.ts'

export const log = async (ctx: Context, next: NextFunction) => {
  const from = ctx.from || { username: `unknown`, id: `unknown` }

  console.log(`Message:`)
  console.dir(ctx.msg)
  console.log(`======`)

  const messageId = `(id:${ctx.msg?.message_id})`
  console.log(`Got message ${messageId} from: @${from.username}[${from.id}]`)
  // take time before
  const before = Date.now() // milliseconds
  // invoke downstream middleware
  await next() // make sure to `await`!
  // take time after
  // log difference
  console.log(`Response time ${messageId}: ${Date.now() - before} ms`)
}
