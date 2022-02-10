import { config } from "https://deno.land/x/dotenv/mod.ts";
import { webhookCallback } from "https://deno.land/x/grammy/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { createBot } from "./bot.ts";

if (Deno[`readFileSync`]) {
  config({
    safe: true,
    export: true,
  });
}

const token = Deno.env.get(`TELEGRAM_TOKEN`)?.trim();
const projectId = Deno.env.get(`DENO_PROJECT_ID`) || `telegram-saunabot`;
const deploymentId = Deno.env.get(`DENO_DEPLOYMENT_ID`);

console.log(
  `Deno deploy url: https://${projectId}${
    deploymentId ? `-${deploymentId}` : ``
  }.deno.dev`,
);

console.log(`TG token: "${token && token.length > 0 ? `set` : `not set`}"`);

if (!token) {
  Deno.exit(1);
}

const bot = createBot(token);
if (!deploymentId) {
  bot.start();
} else {
  const router = new Router();
  router
    .get("/", (ctx) => {
      ctx.response.body = "Hello world!";
    })
    .post(`/bot`, webhookCallback(bot, `oak`));

  const app = new Application();
  // Logger
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(
      `${ctx.request.method} ${ctx.request.url} - ${ctx.response.status} "${ctx.response.type}" in ${ms}ms`,
    );
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.addEventListener(
    "listen",
    (e) => console.log("Listening on http://localhost:8000"),
  );
  await app.listen({ port: 8000 });
}

console.log(`Bot has been started: https://t.me/snezhdanov_bot`);
