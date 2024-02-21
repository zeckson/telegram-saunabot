import { bot, printBotInfo } from './src/bot.ts'

await bot.init()
bot.start()

printBotInfo()
