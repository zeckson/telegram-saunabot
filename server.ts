import { bot, printBotInfo } from './src/bot.ts'
import { webhookCallback } from './src/deps.ts'

const handleUpdate : (...args: Request[]) => Promise<Response> = webhookCallback(bot, 'std/http')


const projectId = Deno.env.get(`DENO_PROJECT_ID`) || `telegram-saunabot`
const deploymentId = Deno.env.get(`DENO_DEPLOYMENT_ID`)
const deployUrl = deploymentId
  ? `https://${projectId}${deploymentId ? `-${deploymentId}` : ``}.deno.dev`
  : `http://localhost:8000`

const DEFAULT_RESPONSE = new Response(`Hello World!
${deployUrl}`, {
  headers: { 'content-type': 'text/plain' },
})
Deno.serve(async (req) => {
  let response = DEFAULT_RESPONSE

  const start = Date.now()
  if (req.method == 'POST') {
    const url = new URL(req.url)
    if (url.pathname.slice(1) == bot.token) {
      console.log('Got webhook request')
      try {
        response = await handleUpdate(req)
      } catch (err) {
        console.error(err)

        response = Response.error()
      }
    }
  }

  console.debug(
    `${req.method} ${req.url} - ${response.status} "${response.type}" in ${
      Date.now() - start
    }ms`,
  )
  return response
})

console.log(`Deno deploy url: ${deployUrl}`)

// 5. Set webhook only for production
await bot.api.setWebhook(`${deployUrl}/${bot.token}`)

await bot.init()

printBotInfo()
