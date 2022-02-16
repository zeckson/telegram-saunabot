import { Bot, Context, NextFunction } from "https://deno.land/x/grammy/mod.ts";

const log = async (ctx: Context, next: NextFunction) => {
  const from = ctx.from || { username: `unknown`, id: `unknown` }

  console.log(`Message:`)
  console.dir(ctx.msg)
  console.log(`======`)

  const messageId = `(id:${ctx.msg?.message_id})`
  console.log(`Got message ${messageId} from: @${from.username}[${from.id}]`)
  // take time before
  const before = Date.now(); // milliseconds
  // invoke downstream middleware
  await next(); // make sure to `await`!
  // take time after
  // log difference
  console.log(`Response time ${messageId}: ${Date.now() - before} ms`);
}

export const createBot = (token: string) => {
  // Create bot object
  const bot = new Bot(token);

  bot.use(log);

  // Listen for messages
  bot.command(`start`, (ctx) => ctx.reply(`Welcome! Send me a photo!`));

  bot.on(`message:text`, (ctx) => ctx.reply(`That is text and not a photo!`));
  bot.on(`message:photo`, (ctx) => ctx.reply(`Nice photo! Is that you?`));

  bot.on(
    `edited_message`,
    (ctx) =>
      ctx.reply(`Ha! Gotcha! You just edited this!`, {
        reply_to_message_id: ctx.editedMessage.message_id,
      }),
  );

  return bot;
};
