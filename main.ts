import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Bot } from "https://deno.land/x/grammy/mod.ts";

if (Deno[`readFileSync`]) {
  config({
    safe: true,
    export: true,
  });
}

const token = Deno.env.get(`TELEGRAM_TOKEN`)?.trim();
const deploymentId = Deno.env.get(`DENO_DEPLOYMENT_ID`);

console.dir(Deno.env.toObject())
console.log(`Deno deployment id: ${deploymentId}`);

console.log(`TG token: "${token && token.length > 0 ? `set` : `not set`}"`);

if (!token) {
  Deno.exit(1);
}

console.log(`Listening on http://localhost:8000`);

serve((_req) => {
  return new Response(`Hello World!`, {
    headers: { "content-type": `text/plain` },
  });
});

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

// Launch!
bot.start();

console.log(`Bot has been started: https://t.me/snezhdanov_bot`);
