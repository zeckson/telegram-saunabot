import { config } from "./src/deps.ts";
import { createBot } from "./src/bot.ts";
import { setupWebhook } from "./src/webhook.ts";

if (Deno[`readFileSync`]) {
  config({
    safe: true,
    export: true,
  });
}

const projectId = Deno.env.get(`DENO_PROJECT_ID`) || `telegram-saunabot`;
const deploymentId = Deno.env.get(`DENO_DEPLOYMENT_ID`);
const deployUrl = deploymentId ?
  `https://${projectId}${deploymentId ? `-${deploymentId}` : ``}.deno.dev` :
  `http://localhost:8000`;

const token = Deno.env.get(`TELEGRAM_TOKEN`)?.trim();
console.log(`TG token: "${token && token.length > 0 ? `set` : `not set`}"`);

if (!token) {
  Deno.exit(1);
}

const bot = createBot(token);
await bot.init();

if (!deploymentId) {
  bot.start();
} else {
  await setupWebhook(bot);
  console.log(
    `Deno deploy url: ${deployUrl}`,
  );
}

console.log(`Bot has been started: https://t.me/${bot.botInfo.username}`);
