import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/server',{recursive:true});
await cp('.output/server','dist/server',{recursive:true});
await cp('.output/public','dist/client',{recursive:true});
await import('node:fs/promises').then(fs=>fs.writeFile('dist/server/index.js',"export { default } from './index.mjs';\n"));
