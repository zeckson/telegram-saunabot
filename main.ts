import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Bot } from "https://deno.land/x/grammy/mod.ts";

const settingsMap = config({ safe: true });
console.log(settingsMap);

console.log(`Listening on http://localhost:8000`);

serve((_req) => {
  return new Response(`Hello World!`, {
    headers: { "content-type": `text/plain` },
  });
});

// Create bot object
const bot = new Bot(settingsMap[`TELEGRAM_TOKEN`]); // <-- place your bot token inside this string

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

// Launch!
bot.start();
