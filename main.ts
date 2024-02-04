import { bot } from "./src/bot.ts";

await bot.init();
bot.start();

console.log(`Bot has been started: https://t.me/${bot.botInfo.username}`);
