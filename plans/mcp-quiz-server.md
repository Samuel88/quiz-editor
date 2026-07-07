# Piano: Server MCP per interrogazione quiz via LLM (Cloudflare Workers + D1)

## Contesto

Oggi le domande vivono come JSON statici in `public/questions/` di questo repo e vengono
consumate solo dall'app React `quiz-editor` per far fare il quiz a un utente nel browser.

Obiettivo di questo piano: un **nuovo progetto separato**, un **server MCP (Model Context
Protocol) remoto**, che espone le domande dei quiz come *tool* utilizzabili da un client
LLM (Claude Desktop/Code, ChatGPT, o qualsiasi altro client MCP). L'LLM stesso conduce
l'interrogazione in linguaggio naturale con l'utente: fa una domanda alla volta, valuta la
risposta, spiega perché è giusta/sbagliata, tiene il punteggio nella conversazione.

Questo NON è un backend per l'app `quiz-editor` esistente: è un progetto a sé, con una
propria copia dei dati. Le due fonti (JSON di questo repo, DB del nuovo server) restano
separate e vengono sincronizzate solo tramite import iniziale (vedi sezione Migrazione).

## Decisioni architetturali (già prese)

| Decisione | Scelta |
|---|---|
| Scope | Solo lettura: elencare quiz e servire domande. Niente CRUD/gestione contenuti da MCP per ora |
| Hosting | Cloudflare Workers, remoto |
| Storage | Cloudflare D1 (SQLite) |
| Gestione stato quiz (punteggio, domanda corrente) | **Nessuno stato lato server**: il server restituisce le domande complete (incluse `corretta` e `spiegazione`); è l'LLM client a condurre l'interrogazione e a non rivelare la risposta prima del tentativo dell'utente |
| Autenticazione | Nessuna per ora (endpoint pubblici in lettura). Da aggiungere (OAuth) solo se in futuro si introducono tool di scrittura |
| Relazione con l'app quiz-editor | Fonti dati separate. Il nuovo DB viene popolato con un import one-off dai JSON esistenti; da quel momento in poi evolvono in modo indipendente |
| Consumer | Client MCP generici (Claude, ChatGPT, altri), non l'app web |

### Nota sul rischio "risposta svelata in anticipo"

Consegnare `corretta` e `spiegazione` insieme al testo della domanda significa che l'LLM
riceve tutto il necessario per rispondere lui stesso. La mitigazione non è architetturale
ma di **prompting**: la description del tool e (idealmente) un MCP *prompt* dedicato devono
istruire esplicitamente il client a non rivelare `corretta`/`spiegazione` finché l'utente
non ha risposto. È un compromesso accettato (vedi risposta sopra): più semplice da
costruire, ma meno robusto di un'alternativa stateful lato server (Durable Object che tiene
la domanda attiva e nasconde la risposta finché non arriva un tentativo). Se in futuro
emergono problemi reali di LLM che "spoilerano" le risposte, quella è la strada da
percorrere (vedi Roadmap).

## Stack tecnologico

- **Runtime**: Cloudflare Workers
- **Framework MCP**: `agents` (Cloudflare Agents SDK) + `@modelcontextprotocol/sdk` + `zod`
  per la validazione degli input dei tool
- **Storage**: Cloudflare D1 (SQLite), accesso via binding diretto dal Worker
- **Transport MCP**: Streamable HTTP (`McpAgent.serve("/mcp")`) — è il transport
  raccomandato per client esterni/pubblici; SSE è legacy/deprecato
- **Nuovo repo**: progetto separato, nome proposto `quiz-mcp-server`

### Perché serve comunque un Durable Object se il server è "stateless"

Anche se non teniamo stato applicativo (punteggio, domanda attiva), l'implementazione di
`McpAgent` di Cloudflare si appoggia comunque su un Durable Object per gestire la
connessione MCP a livello di protocollo — è un dettaglio infrastrutturale della libreria,
non introduce stato di dominio. Va comunque dichiarato in `wrangler.jsonc` (binding +
migrazione `new_sqlite_classes`).

## Scaffold del nuovo progetto

```bash
mkdir quiz-mcp-server && cd quiz-mcp-server
npm create cloudflare@latest . -- --type=hello-world  # o partire da zero con wrangler init
npm install agents @modelcontextprotocol/sdk zod
```

Struttura proposta:

```
quiz-mcp-server/
├── src/
│   └── index.ts          # entry point Worker + classe McpAgent
├── migrations/            # migrazioni SQL D1 (schema tabelle)
│   └── 0001_init.sql
├── scripts/
│   └── import-quizzes.mjs # script di import one-off dai JSON di quiz-editor
├── wrangler.jsonc
├── tsconfig.json          # extends "agents/tsconfig"
└── package.json
```

## Schema dati (D1)

```sql
-- migrations/0001_init.sql
CREATE TABLE quizzes (
  id        TEXT PRIMARY KEY,   -- stesso slug usato oggi in quizzes.js (es. 'html', 'css')
  title     TEXT NOT NULL,
  subtitle  TEXT,
  topics    TEXT               -- JSON array serializzato, es. '["Tag","Attributi"]'
);

CREATE TABLE questions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id       TEXT NOT NULL REFERENCES quizzes(id),
  domanda       TEXT NOT NULL,
  snippet       TEXT,           -- nullable
  risposte      TEXT NOT NULL,  -- JSON array serializzato, es. '["a","b","c"]'
  corretta      INTEGER NOT NULL,
  spiegazione   TEXT NOT NULL,
  tempo         INTEGER,        -- nullable, secondi
  ordine        INTEGER NOT NULL  -- posizione originale nel file JSON, per riproducibilità
);

CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
```

Non è necessaria alcuna tabella di sessione/punteggio, coerentemente con la scelta di non
tenere stato lato server.

## Migrazione dei dati esistenti

Script one-off (`scripts/import-quizzes.mjs`), eseguito localmente una tantum:

1. Legge `src/quizzes.js` da questo repo (`quiz-editor`) per i metadati (`id`, `title`,
   `subtitle`, `topics`) — passare il path del repo come argomento allo script o copiarne
   una snapshot in `quiz-mcp-server` al momento dell'import.
2. Per ogni quiz, legge il file JSON corrispondente in `public/questions/<slug>.json`.
3. Genera statement `INSERT` per `quizzes` e `questions` e li applica con
   `wrangler d1 execute <DB_NAME> --remote --file=./seed.sql` (o `--local` per lo sviluppo).
4. Idempotenza: lo script può fare `DELETE FROM questions; DELETE FROM quizzes;` prima di
   reinserire, così può essere rieseguito in sicurezza per rigenerare il DB da zero.

Questo è un import singolo all'avvio del progetto: da quel momento, eventuali nuove
domande aggiunte solo ai JSON di `quiz-editor` NON compaiono automaticamente nel MCP
server, a meno di rieseguire manualmente lo script (fonti dati separate, per scelta).

## Design dei tool MCP

Tre tool, minimi e mirati al caso d'uso "un LLM interroga una persona":

### `list_quizzes`
- Input: nessuno (o `topic?: string` opzionale per filtrare)
- Output: array di `{ id, title, subtitle, topics, questionCount }`
- Uso: l'LLM lo chiama per proporre all'utente tra quali argomenti scegliere

### `get_quiz_questions`
- Input: `{ quizId: string, limit?: number, shuffle?: boolean }` (zod schema)
- Output: array di domande complete: `{ domanda, snippet?, risposte, corretta, spiegazione, tempo? }`
- `description` del tool esplicita e prescrittiva, es.:
  > "Restituisce le domande del quiz richiesto, comprese le risposte corrette e le
  > spiegazioni. IMPORTANTE: non mostrare mai `corretta` o `spiegazione` all'utente prima
  > che abbia risposto. Fai una domanda alla volta, aspetta la risposta dell'utente, poi
  > rivela se è corretta e la spiegazione, quindi passa alla domanda successiva. Tieni il
  > conteggio delle risposte corrette e mostra il punteggio finale alla fine."

### `list_topics` (opzionale, comodità)
- Input: nessuno
- Output: elenco unico di tutti i `topics` su tutti i quiz, utile per far scegliere
  l'utente per argomento invece che per quiz specifico

### MCP Prompt dedicato (consigliato, non obbligatorio)

Oltre ai tool, MCP supporta la primitiva **prompt**: un template riutilizzabile che il
client può esporre all'utente (es. come slash command). Proposta:

- Nome: `conduci_quiz`
- Argomenti: `quizId`
- Contenuto: istruzioni esplicite step-by-step su come condurre l'interrogazione (una
  domanda alla volta, non rivelare la risposta, mostrare punteggio finale) — spostano la
  logica di "come comportarsi" fuori dalla description del singolo tool e la rendono
  invocabile esplicitamente dall'utente ("usa il prompt conduci_quiz per il quiz css").

Questo rinforza (senza garantirlo al 100%) il comportamento corretto lato LLM, senza
richiedere stato lato server.

## Sicurezza

- Tutti i tool sono di **sola lettura** e **pubblici**, nessuna autenticazione nella prima
  versione: chiunque conosca l'URL del server può leggere tutte le domande e risposte.
  Accettabile per contenuti didattici pubblici; da rivalutare se in futuro si aggiungono
  quiz con contenuti sensibili o si introduce editing.
- Se in futuro si aggiungono tool di scrittura (creazione/modifica domande), aggiungere
  `@cloudflare/workers-oauth-provider` davanti al server per proteggere solo quei tool,
  lasciando quelli di lettura pubblici.

## Configurazione `wrangler.jsonc`

```jsonc
{
  "name": "quiz-mcp-server",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-28",
  "compatibility_flags": ["nodejs_compat"],
  "durable_objects": {
    "bindings": [{ "name": "QuizMCP", "class_name": "QuizMCP" }]
  },
  "migrations": [
    { "tag": "v1", "new_sqlite_classes": ["QuizMCP"] }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "quiz-mcp-db",
      "database_id": "<generato da `wrangler d1 create quiz-mcp-db`>"
    }
  ]
}
```

## Implementazione (schema di massima)

```typescript
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

export class QuizMCP extends McpAgent<Env, {}, {}> {
  server = new McpServer({ name: "quiz-mcp-server", version: "1.0.0" });

  async init() {
    this.server.registerTool("list_quizzes", {
      description: "Elenca i quiz disponibili con titolo, argomenti e numero di domande.",
      inputSchema: {}
    }, async () => {
      const { results } = await this.env.DB.prepare(
        "SELECT id, title, subtitle, topics, (SELECT COUNT(*) FROM questions WHERE quiz_id = quizzes.id) as questionCount FROM quizzes"
      ).all();
      return { content: [{ type: "text", text: JSON.stringify(results) }] };
    });

    this.server.registerTool("get_quiz_questions", {
      description: "Restituisce le domande di un quiz, incluse risposte corrette e spiegazioni. Non rivelarle all'utente prima che risponda: fai una domanda alla volta.",
      inputSchema: { quizId: z.string(), limit: z.number().optional(), shuffle: z.boolean().optional() }
    }, async ({ quizId, limit, shuffle }) => {
      const { results } = await this.env.DB.prepare(
        "SELECT domanda, snippet, risposte, corretta, spiegazione, tempo FROM questions WHERE quiz_id = ? ORDER BY ordine"
      ).bind(quizId).all();
      let questions = results.map(r => ({ ...r, risposte: JSON.parse(r.risposte) }));
      if (shuffle) questions = questions.sort(() => Math.random() - 0.5);
      if (limit) questions = questions.slice(0, limit);
      return { content: [{ type: "text", text: JSON.stringify(questions) }] };
    });
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return QuizMCP.serve("/mcp", { binding: "QuizMCP" }).fetch(request, env, ctx);
  }
};
```

## Testing locale

```bash
wrangler d1 create quiz-mcp-db
wrangler d1 execute quiz-mcp-db --local --file=./migrations/0001_init.sql
node scripts/import-quizzes.mjs --repo ../quiz-editor   # genera seed.sql
wrangler d1 execute quiz-mcp-db --local --file=./seed.sql

wrangler dev
npx @modelcontextprotocol/inspector@latest   # connettersi a http://localhost:8787/mcp
```

Verificare con l'Inspector: `list_quizzes` restituisce l'elenco corretto, `get_quiz_questions`
restituisce le domande con lo schema atteso, i campi `risposte` sono array (non stringhe
JSON grezze) nell'output finale.

## Deployment

```bash
wrangler d1 execute quiz-mcp-db --remote --file=./migrations/0001_init.sql
wrangler d1 execute quiz-mcp-db --remote --file=./seed.sql
wrangler deploy
```

URL finale del server: `https://quiz-mcp-server.<account>.workers.dev/mcp`

## Collegare un client MCP

- **Claude Desktop / Claude Code**: aggiungere il server remoto nella configurazione MCP
  (URL-based connector) puntando a `https://.../mcp`.
- **ChatGPT**: il supporto ai connettori MCP remoti dipende dal piano/versione del
  client — da verificare al momento dell'implementazione, la disponibilità di questa
  funzionalità cambia nel tempo.

## Riepilogo file (nuovo repo `quiz-mcp-server`)

| File | Contenuto |
|---|---|
| `src/index.ts` | Classe `QuizMCP` (McpAgent), registrazione tool, entry point Worker |
| `migrations/0001_init.sql` | Schema tabelle `quizzes`/`questions` |
| `scripts/import-quizzes.mjs` | Import one-off dai JSON di `quiz-editor` → `seed.sql` |
| `wrangler.jsonc` | Binding D1 + Durable Object + migrazioni |
| `package.json` | Dipendenze: `agents`, `@modelcontextprotocol/sdk`, `zod` |

## Rischi e limiti noti

- L'LLM potrebbe comunque rivelare la risposta corretta in anticipo (nessuna garanzia
  server-side) — mitigato solo da prompting (tool description + MCP prompt dedicato).
- Nessuna autenticazione: server pubblico in lettura.
- Le due fonti dati (JSON di `quiz-editor` e D1 di `quiz-mcp-server`) divergono nel tempo;
  senza un processo di sync, chi aggiunge domande in un posto deve ricordarsi di
  aggiornare anche l'altro (o rieseguire manualmente l'import).

## Roadmap futura (fuori scope per questo piano)

- Aggiungere tool di scrittura (creare/modificare/eliminare domande) protetti da OAuth
  (`@cloudflare/workers-oauth-provider`), per gestire i contenuti direttamente parlando
  con un assistente AI invece che editando JSON a mano.
- Se il "leak" delle risposte da parte dell'LLM si rivela un problema reale in pratica,
  passare a un design stateful: un Durable Object per sessione di quiz che tiene la
  domanda attiva e il punteggio, restituendo una domanda alla volta SENZA `corretta`/
  `spiegazione`, rivelate solo dopo la chiamata a un tool `submit_answer`.
- Valutare se unificare le due fonti dati (far leggere anche l'app `quiz-editor` da D1
  invece che dai JSON statici), se emerge la necessità di un'unica fonte di verità.
