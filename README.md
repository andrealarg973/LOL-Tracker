# Rift Recap

Tracker League of Legends con **Nuxt 4, Vue 3, TypeScript e Tailwind CSS 4**. UI italiana, layout responsive, icone Lucide e immagini ufficiali Riot Data Dragon. La demo è esplicitamente sintetica: nessuna statistica fittizia è attribuita a un giocatore reale.

## Avvio locale

Richiede Node 22.12+ o una versione LTS più recente compatibile con Nuxt.

```bash
npm ci
cp .env.example .env
# Inserisci NUXT_RIOT_API_KEY nel file .env
npm run dev
```

Per aggiornare il catalogo ufficiale prima di ricompilare:

```bash
node scripts/sync-data.mjs
```

`npm run typecheck` verifica TypeScript. `npm run build` compila l’app Nuxt/Nitro. La configurazione rileva Netlify (`NETLIFY`) e genera il runtime serverless necessario alle API `/api/*`; in locale e su Cloudflare mantiene il preset Cloudflare. Su Netlify usa il comando `npm run build`, directory pubblica `.output/public` e Node 22. Imposta `NUXT_RIOT_API_KEY` nelle variabili d’ambiente di Netlify se vuoi cercare profili reali.

## Configurazione Riot

Genera una development key su https://developer.riotgames.com e configura **NUXT_RIOT_API_KEY esclusivamente nell'ambiente server**. Non inserirla nel client, nei commit, in una URL o nel campo di ricerca. La pagina “Dati & API” mostra solo se è configurata, mai il valore. Le chiavi di sviluppo scadono dopo 24 ore. Per servire utenti pubblicamente devi registrare il prodotto presso Riot e ottenere una chiave/approvazione adeguata.

Su Sites la variabile deve essere salvata come secret nell'ambiente del sito, poi ripubblicata. La pubblicazione iniziale è privata e funziona in demo senza alcuna chiave.

## Funzionalità

- Ricerca Riot ID Nome#TAG con instradamento piattaforma/regione.
- Profilo, livello, icona, rank Solo/Duo e Flex, LP, vittorie/sconfitte ranked.
- Maestria campioni, campioni più giocati nel campione caricato.
- Storico paginato a 10 partite, filtri, KDA aggregato, media CS/min, danni e visione.
- Tabellino espandibile: 10 giocatori, K/D/A, danni, CS, oggetti, obiettivi delle squadre, rune e summoner spell del giocatore.
- Timeline ufficiale con eventi per minuto nelle partite reali.
- Spectator live, sfide e stato dei server.
- Catalogo completo Data Dragon dei campioni con abilità, lore, statistiche base e nomi delle skin.
- Oggetti acquistabili nella Landa, ricerca, filtri, dettagli e ricette navigabili.
- Esportazione JSON di profilo e dettagli completi delle partite caricate.

## Endpoint applicativi

| Endpoint | API Riot |
|---|---|
| `/api/profile?name=...&tag=...&region=euw1` | Account-v1, Summoner-v4, League-v4, Champion-Mastery-v4 |
| `/api/matches?puuid=...&region=euw1&start=0` | Match-v5 lista e dettagli |
| `/api/extra?kind=timeline&match=EUW1_...&region=euw1` | Match-v5 timeline |
| `/api/extra?kind=live&puuid=...&region=euw1` | Spectator-v5 |
| `/api/extra?kind=challenges&puuid=...&region=euw1` | LoL-Challenges-v1 |
| `/api/extra?kind=status&region=euw1` | LoL-Status-v4 |
| `/api/extra?kind=rotation&region=euw1` | Champion-v3 (endpoint disponibile, nessuna vista dedicata) |
| `/api/extra?kind=ladder&region=euw1` | Challenger League-v4 (endpoint disponibile, nessuna vista dedicata) |
| `/api/champion?id=Ahri&version=16.19.1` | Data Dragon dettagli campione |
| `/api/catalog?kind=champion` | Snapshot incluso: champion, item, summoner, runes, version |

## Limiti espliciti

Il sito non enumera tutti gli account Riot: cerca un Riot ID. Non mostra MMR nascosto, email, chat, inventario posseduto o storico LP inventato. I riepiloghi sono calcolati **solo sulle partite caricate e filtrate**, il rank è uno snapshot corrente. Le partite personalizzate sono escluse anche dalla timeline. Le icone degli oggetti storici sono visualizzate con la patch attuale del catalogo, quindi possono non rispecchiarne le vecchie proprietà. Le statistiche globali di meta richiederebbero una raccolta separata su larga scala; non sono simulate.

La cache è in memoria per singolo isolate, non persistente o distribuita. Le richieste dei dettagli sono sequenziali; gli errori 429 attivano un cooldown da Retry-After. Non è un rate limiter globale: per grandi volumi servono coordinamento distribuito, cache persistente e i limiti autorizzati da Riot. Non memorizziamo profili in database. Il catalogo è uno snapshot aggiornabile con il comando dedicato; non è una sincronizzazione schedulata.

Non essendo stata fornita una API key reale, le chiamate autenticate non sono state validate contro l'account Riot. Le verifiche locali coprono build, tipi, rendering server, catalogo, validazione degli input e risposta senza chiave.

## Fonti

- https://developer.riotgames.com/docs/lol
- https://developer.riotgames.com/docs/portal
- https://developer.riotgames.com/apis
- https://ddragon.leagueoflegends.com/api/versions.json

Rift Recap is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
