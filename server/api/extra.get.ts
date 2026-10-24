import {riot,regionOf,platforms,validPuuid} from '../utils/riot'
export default defineEventHandler(async event=>{
 const q=getQuery(event),p=regionOf(q.region),kind=String(q.kind)
 if(kind==='status') return riot(event,p,'/lol/status/v4/platform-data',60)
 if(kind==='rotation') return riot(event,p,'/lol/platform/v3/champion-rotations',3600)
 if(kind==='ladder') return riot(event,p,'/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5',300)
 if(kind==='timeline') { const id=String(q.match||'');if(!/^[A-Z0-9]+_\d+$/.test(id)) throw createError({statusCode:400,statusMessage:'Match ID non valido'});const m=await riot(event,platforms[p]!,`/lol/match/v5/matches/${id}`,3600);if(m.info.gameType==='CUSTOM_GAME'||m.info.queueId===0)throw createError({statusCode:403,statusMessage:'Partite personalizzate non disponibili'});return riot(event,platforms[p]!,`/lol/match/v5/matches/${id}/timeline`,3600) }
 const id=validPuuid(q.puuid)
 if(kind==='live') {try{return await riot(event,p,`/lol/spectator/v5/active-games/by-summoner/${id}`,30)}catch(e:any){if(e.statusCode===404)return {active:false};throw e}}
 if(kind==='challenges') return riot(event,p,`/lol/challenges/v1/player-data/${id}`,300)
 throw createError({statusCode:400,statusMessage:'Richiesta non valida'})
})
