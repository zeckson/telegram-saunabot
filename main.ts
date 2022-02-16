import { config } from "https://deno.land/x/dotenv/mod.ts";
import { createBot } from "./src/bot.ts";
import { setupWebhook } from "./src/webhook.ts";

if (Deno[`readFileSync`]) {
  config({
    safe: true,
    export: true,
  });
}

const token = Deno.env.get(`TELEGRAM_TOKEN`)?.trim();
const projectId = Deno.env.get(`DENO_PROJECT_ID`) || `telegram-saunabot`;
const deploymentId = Deno.env.get(`DENO_DEPLOYMENT_ID`);

console.log(`TG token: "${token && token.length > 0 ? `set` : `not set`}"`);

if (!token) {
  Deno.exit(1);
}

const bot = createBot(token);
await bot.init()

if (!deploymentId) {
  bot.start();
} else {
  await setupWebhook(bot);
  console.log(
    `Deno deploy url: https://${projectId}${
      deploymentId ? `-${deploymentId}` : ``
    }.deno.dev`,
  );
}

console.log(`Bot has been started: https://t.me/${bot.botInfo.username}`);
