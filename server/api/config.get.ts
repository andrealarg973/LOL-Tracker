export default defineEventHandler(event=>({configured:!!(useRuntimeConfig(event).riotApiKey || event.context.cloudflare?.env?.NUXT_RIOT_API_KEY)}))
