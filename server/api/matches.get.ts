import { riot,regionOf,platforms,validPuuid } from '../utils/riot'
export default defineEventHandler(async event=>{
 const q=getQuery(event),p=regionOf(q.region),puuid=validPuuid(q.puuid),start=Math.max(0,Math.min(1000,Number(q.start)||0))
 const ids=await riot<string[]>(event,platforms[p]!,`/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=10`,90)
 const matches:any[]=[];let failed=0
 // Sequential calls keep bursts within development-key limits. Immutable details are cached.
 for(const id of ids) {try {const m=await riot(event,platforms[p]!,`/lol/match/v5/matches/${id}`,3600); if(m.info.gameType!=='CUSTOM_GAME'&&m.info.queueId!==0) matches.push(m)} catch(e:any){if(e.statusCode===429||e.statusCode===401||e.statusCode===403) throw e;failed++}}
 return {matches,next:start+ids.length,hasMore:ids.length===10,failed}
})
