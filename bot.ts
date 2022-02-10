import { Bot } from "https://deno.land/x/grammy/mod.ts";

const token = Deno.env.get(`TELEGRAM_TOKEN`)?.trim();
const projectId = Deno.env.get(`DENO_PROJECT_ID`) || `telegram-saunabot`;
const deploymentId = Deno.env.get(`DENO_DEPLOYMENT_ID`);

export const createBot = (token: string) => {
  // Create bot object
  const bot = new Bot(token);

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
