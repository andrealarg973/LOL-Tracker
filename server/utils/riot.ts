import type { H3Event } from 'h3'
export const platforms: Record<string,string> = { euw1:'europe',eun1:'europe',tr1:'europe',ru:'europe',na1:'americas',br1:'americas',la1:'americas',la2:'americas',kr:'asia',jp1:'asia',oc1:'sea',sg2:'sea',tw2:'sea',vn2:'sea' }
const cache = new Map<string,{ expires:number, data:unknown }>()
let blockedUntil = 0
export function regionOf(value: unknown) { const p=String(value||'euw1').toLowerCase(); if(!platforms[p]) throw createError({statusCode:400,statusMessage:'Regione non valida'}); return p }
export async function riot<T=any>(event:H3Event, host:string, path:string, ttl=60):Promise<T> {
 const key = useRuntimeConfig(event).riotApiKey || process.env.NUXT_RIOT_API_KEY || event.context.cloudflare?.env?.NUXT_RIOT_API_KEY
 if(!key) throw createError({statusCode:503,statusMessage:'Configura NUXT_RIOT_API_KEY sul server per cercare giocatori reali.'})
 const id=host+path; const hit=cache.get(id); if(hit && hit.expires>Date.now()) return hit.data as T
 if(blockedUntil>Date.now()) { setHeader(event,'Retry-After',Math.ceil((blockedUntil-Date.now())/1000)); throw createError({statusCode:429,statusMessage:'Limite Riot raggiunto. Riprova tra poco.'}) }
 try { const data=await $fetch<T>(`https://${host}.api.riotgames.com${path}`,{headers:{'X-Riot-Token':String(key)},timeout:15000,retry:0}); if(cache.size>500) cache.clear(); cache.set(id,{data,expires:Date.now()+ttl*1000}); return data }
 catch(e:any) { const code=e.response?.status||502; if(code===429) {const seconds=Number(e.response?.headers?.get('retry-after'))||60; blockedUntil=Date.now()+seconds*1000;setHeader(event,'Retry-After',seconds)} throw createError({statusCode:code,statusMessage:code===404?'Giocatore o dato non trovato. Controlla Riot ID e regione.':code===403||code===401?'Chiave Riot scaduta o non autorizzata. Aggiornala sul server.':code===429?'Limite Riot raggiunto. Riprova tra poco.':'Riot non è disponibile. Riprova tra poco.'}) }
}
export function validPuuid(value:unknown) { const s=String(value||''); if(!/^[\w-]{20,160}$/.test(s)) throw createError({statusCode:400,statusMessage:'PUUID non valido'}); return s }
