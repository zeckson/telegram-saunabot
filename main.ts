import { bot } from "./src/bot.ts";
import { setupWebhook } from "./src/webhook.ts";

const projectId = Deno.env.get(`DENO_PROJECT_ID`) || `telegram-saunabot`;
const deploymentId = Deno.env.get(`DENO_DEPLOYMENT_ID`);
const deployUrl = deploymentId ?
  `https://${projectId}${deploymentId ? `-${deploymentId}` : ``}.deno.dev` :
  `http://localhost:8000`;


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
