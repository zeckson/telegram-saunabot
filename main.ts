import { bot, DEFAULT_CONFIG, onAfterInit } from './src/bot.ts'

await bot.init()
bot.start(DEFAULT_CONFIG).catch((e) => {
  console.error(`Uncaught long-polling error: `, e)
  Deno.exit(1)
})

onAfterInit()
