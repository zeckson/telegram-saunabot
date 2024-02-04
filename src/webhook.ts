import { Bot, webhookCallback } from "./deps.ts";
import { Application, Router } from "./deps.ts";

const WEBHOOK_PORT = 8000;
const WEBHOOK_PATH = `bot`;

export const setupWebhook = async (bot: Bot) => {
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

  // Telegram webhook
  // app.use(webhookCallback(bot, `oak`));

  const router = new Router();
  router
    .get("/", (ctx) => {
      ctx.response.body = "Hello world!";
    })
    .post(`/${WEBHOOK_PATH}`, webhookCallback(bot, `oak`));

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.addEventListener(
    "listen",
    () => console.log(`Listening on http://localhost:${WEBHOOK_PORT}`),
  );
  await app.listen({ port: WEBHOOK_PORT });
};
