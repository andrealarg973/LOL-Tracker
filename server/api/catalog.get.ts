import champion from '../../public/data/champion.json'
import item from '../../public/data/item.json'
import summoner from '../../public/data/summoner.json'
import runes from '../../public/data/runesReforged.json'
import version from '../../public/data/version.json'
export default defineEventHandler(event=>{const data:Record<string,unknown>={champion,item,summoner,runes,version};const kind=String(getQuery(event).kind);if(!(kind in data))throw createError({statusCode:400,statusMessage:'Catalogo non valido'});setHeader(event,'Cache-Control','public, max-age=3600');return data[kind]})
