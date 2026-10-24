import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-09-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  nitro: { preset: 'cloudflare_module' },
  runtimeConfig: { riotApiKey: '' },
  app: { head: { title: 'Rift Recap — League of Legends stats', meta: [{ name: 'description', content: 'Il tuo League of Legends, in prospettiva. Partite, statistiche, campioni e oggetti con dati ufficiali Riot Games.' }], link: [{ rel: 'icon', href: '/favicon.svg' }] } }
})
