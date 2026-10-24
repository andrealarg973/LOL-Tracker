import {writeFile,mkdir} from 'node:fs/promises';
const base='https://ddragon.leagueoflegends.com';
const versions=await fetch(`${base}/api/versions.json`).then(r=>r.json());const version=versions[0];await mkdir('public/data',{recursive:true});
for(const name of ['champion','item','summoner','runesReforged']) {const r=await fetch(`${base}/cdn/${version}/data/it_IT/${name}.json`);if(!r.ok)throw Error(name);await writeFile(`public/data/${name}.json`,await r.text())}
await writeFile('public/data/version.json',JSON.stringify({version,updated:new Date().toISOString()}));console.log('Official Data Dragon '+version)
