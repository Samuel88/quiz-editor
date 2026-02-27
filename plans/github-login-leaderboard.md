# Piano: Login GitHub + Classifica per Quiz (con PocketBase)

## Contesto
L'app quiz è client-side (React + Vite) senza backend né auth. L'utente vuole:
- Login obbligatorio con GitHub prima di accedere ai quiz
- Punteggi e tempi salvati per utente su server PocketBase
- Classifica per ogni quiz (top scores con username e avatar GitHub)

Soluzione: **PocketBase** — server self-hosted (singolo binario), SQLite integrato, OAuth2 con GitHub.

---

## Setup Manuale (prerequisiti fuori dal codice)

### 1. Scaricare e avviare PocketBase
```bash
# Scaricare da https://pocketbase.io/docs/ → il binario per macOS
# Estrarre nella root del progetto o in una directory dedicata
./pocketbase serve
# Admin UI disponibile su: http://localhost:8090/_/
```

### 2. Creare OAuth App su GitHub
- GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
- **Homepage URL:** `http://localhost:5173`
- **Authorization callback URL:** `http://localhost:8090/api/oauth2-redirect`
- Copiare **Client ID** e **Client Secret**

### 3. Configurare GitHub in PocketBase Admin UI
- `http://localhost:8090/_/` → Settings → Auth Providers → GitHub
- Abilitare e inserire Client ID + Client Secret

### 4. Creare la collection `quiz_scores`
- Admin UI → Collections → New Collection → tipo "Base" → nome: `quiz_scores`

**Campi:**
| Campo | Tipo | Opzioni |
|-------|------|---------|
| `user` | Relation | → users collection, required |
| `quiz_id` | Text | required |
| `quiz_title` | Text | required |
| `score` | Number | required, min: 0 |
| `total` | Number | required, min: 1 |
| `time_spent` | Number | required (secondi), min: 0 |

**API Rules (tab "API Rules"):**
- **List/View:** `` (vuoto = pubblico, tutti possono leggere la classifica)
- **Create:** `@request.auth.id != "" && @request.body.user = @request.auth.id`
- **Update/Delete:** nessuno (lasciare vuoto = bloccato)

---

## Dipendenze da installare

```bash
pnpm add pocketbase
```

---

## Nuovi file da creare

### `src/lib/pocketbase.js`
```js
import PocketBase from 'pocketbase'
export const pb = new PocketBase('http://localhost:8090')
```
(URL da rendere configurabile via env var per produzione)

### `src/contexts/AuthContext.jsx`
- Context che espone: `user`, `loading`, `signInWithGitHub()`, `signOut()`
- Legge `pb.authStore.isValid` e `pb.authStore.model` all'avvio
- Si iscrive a `pb.authStore.onChange(...)` per aggiornare lo stato React
- `signInWithGitHub()` → `pb.collection('users').authWithOAuth2({ provider: 'github' })` (popup)
- `signOut()` → `pb.authStore.clear()`
- Il SDK persiste automaticamente la sessione in localStorage

### `src/components/Login.jsx`
- Schermata di benvenuto con titolo app e bottone "Accedi con GitHub"
- Stessa estetica: gradiente viola-rosa, card centrata
- Gestione stato loading durante OAuth popup

### `src/styles/Login.css`
- Stile per la schermata login

### `src/components/Leaderboard.jsx`
- Props: `quizId`
- Al mount: query PocketBase per top 10 punteggi di quel quiz
  ```js
  pb.collection('quiz_scores').getList(1, 10, {
    filter: pb.filter('quiz_id = {:qid}', { qid: quizId }),
    sort: '-score,time_spent',   // migliore punteggio prima, a parità il più veloce
    expand: 'user',
  })
  ```
- Mostra: rank, avatar utente, username, score/total (%), tempo, data
- Evidenzia la riga dell'utente corrente (`pb.authStore.model.id`)

### `src/styles/Leaderboard.css`
- Stile tabella classifica

---

## File da modificare

### `src/main.jsx`
- Wrappare `<App />` con `<AuthProvider>`

### `src/App.jsx`
- Importare `useAuth` da AuthContext
- Se `loading` → mostrare spinner
- Se `!user` → render `<Login />`
- Aggiungere stato `quizStartTime` (null inizialmente)
- In `handleSelectQuiz()` e `restartQuiz()` → `setQuizStartTime(Date.now())`
- In `handleNextQuestion()` all'ultima domanda:
  - `const timeSpent = Math.round((Date.now() - quizStartTime) / 1000)`
  - Passare `timeSpent` a `<Results>` come prop
- Rimuovere la funzione `saveScore` (spostata in Results)
- Passare a `<Results>`: `timeSpent`, `quizId={selectedQuiz}`, `quizTitle`

### `src/components/Results.jsx`
- Nuove props: `timeSpent`, `quizId`, `quizTitle`
- `useEffect` al mount → salva punteggio su PocketBase:
  ```js
  pb.collection('quiz_scores').create({
    user: pb.authStore.model.id,
    quiz_id: quizId,
    quiz_title: quizTitle,
    score: finalScore,
    total,
    time_spent: timeSpent,
  })
  ```
- Rimuovere tutta la logica localStorage
- Sostituire la sezione "Migliori Punteggi" con `<Leaderboard quizId={quizId} />`
- Aggiungere bottone "Esci" che chiama `signOut()` (visibile nell'header o nei risultati)

---

## Flusso Auth

```
App load
  └─ AuthContext: pb.authStore.isValid?
       ├─ NO  → <Login> → click GitHub → popup OAuth → ritorna → pb.authStore aggiornato
       │                                                          └─ React state aggiornato → <QuizSelector>
       └─ SÌ → <QuizSelector>
             └─ seleziona quiz → quizStartTime = Date.now()
                   └─ fine quiz → Results salva su PocketBase + mostra <Leaderboard>
```

---

## Tracking del Tempo

- `quizStartTime` = `Date.now()` salvato in stato App quando il quiz inizia
- `timeSpent` = `Math.round((Date.now() - quizStartTime) / 1000)` calcolato all'ultima domanda
- Valore in secondi interi (es: 87 sec per completare il quiz)
- In classifica: a parità di punteggio, vince chi ha impiegato meno tempo

---

## Riepilogo file

| File | Azione |
|------|--------|
| `src/lib/pocketbase.js` | NUOVO — client PocketBase |
| `src/contexts/AuthContext.jsx` | NUOVO — auth state globale |
| `src/components/Login.jsx` | NUOVO — schermata login GitHub |
| `src/styles/Login.css` | NUOVO — stili login |
| `src/components/Leaderboard.jsx` | NUOVO — classifica per quiz |
| `src/styles/Leaderboard.css` | NUOVO — stili classifica |
| `src/main.jsx` | MODIFICA — aggiungere AuthProvider wrapper |
| `src/App.jsx` | MODIFICA — auth guard, time tracking, nuove props a Results |
| `src/components/Results.jsx` | MODIFICA — salva su PocketBase, mostra Leaderboard, rimuovi localStorage |
| `package.json` | MODIFICA — aggiungere `pocketbase` |

---

## Verifica End-to-End

1. Avviare PocketBase: `./pocketbase serve`
2. `pnpm dev` → app su `localhost:5173`
3. Prima schermata = pagina login con bottone GitHub
4. Click → popup GitHub → autorizzazione → popup si chiude → app mostra QuizSelector
5. Header mostra avatar e username GitHub dell'utente
6. Completa un quiz → schermata risultati con classifica
7. Admin UI PocketBase → Collections → quiz_scores → record inserito correttamente
8. Completare stesso quiz con account GitHub diverso → entrambi visibili in classifica
9. Refresh pagina → utente ancora loggato (sessione persistita in localStorage)
