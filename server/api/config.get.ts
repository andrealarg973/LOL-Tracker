export default defineEventHandler(event => {
  const config = useRuntimeConfig(event)
  const configured = Boolean(config.riotApiKey || process.env.NUXT_RIOT_API_KEY || event.context.cloudflare?.env?.NUXT_RIOT_API_KEY)
  return { configured }
})
