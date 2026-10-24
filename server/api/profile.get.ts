import { riot,regionOf,platforms } from '../utils/riot'
export default defineEventHandler(async event=>{
 const q=getQuery(event),p=regionOf(q.region), name=String(q.name||'').trim(),tag=String(q.tag||'').trim()
 if(!name||!tag||name.length>64||tag.length>16) throw createError({statusCode:400,statusMessage:'Inserisci il Riot ID completo: Nome#TAG'})
 const account=await riot(event,platforms[p]!,`/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,300)
 const summoner=await riot(event,p,`/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,300)
 const errors:string[]=[]
 const ranked=await riot(event,p,`/lol/league/v4/entries/by-puuid/${account.puuid}`,120).catch((e:any)=>{errors.push('Classificata: '+e.statusMessage);return null})
 const mastery=await riot(event,p,`/lol/champion-mastery/v4/champion-masteries/by-puuid/${account.puuid}/top?count=8`,300).catch((e:any)=>{errors.push('Maestria: '+e.statusMessage);return null})
 return {account,summoner,ranked,mastery,errors,region:p}
})
