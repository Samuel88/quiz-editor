# Guida alla creazione di file di domande

Ogni file in questa cartella è un array JSON di domande per il quiz editor.

## Schema di una domanda

```json
{
  "domanda": "Testo della domanda?",
  "snippet": "```js\n// codice opzionale mostrato prima delle risposte\n```",
  "risposte": [
    "Prima risposta",
    "Seconda risposta",
    "Terza risposta"
  ],
  "corretta": 0,
  "spiegazione": "Spiegazione mostrata dopo la risposta."
}
```

### Campi

| Campo       | Tipo     | Obbligatorio | Descrizione |
|-------------|----------|:------------:|-------------|
| `domanda`   | string   | ✅ | Testo della domanda. Può contenere backtick per il codice inline. |
| `risposte`  | string[] | ✅ | Array di esattamente **3** risposte. Possono contenere backtick per codice inline. |
| `corretta`  | number   | ✅ | Indice (0-based) della risposta corretta nell'array `risposte`. |
| `spiegazione` | string | ✅ | Spiegazione della risposta corretta. Supporta markdown (backtick, **grassetto**, *corsivo*, liste). |
| `snippet`   | string   | ❌ | Blocco di codice opzionale mostrato sopra le risposte. Usare la sintassi fenced ` ```lang\n...\n``` `. |

## Regole di qualità

- Le domande e le risposte sono scritte **in italiano**.
- Ogni domanda ha esattamente **3 risposte**: una corretta e due distrattori plausibili.
- I distrattori devono essere credibili (errori comuni, misconcezioni frequenti), non palesemente sbagliati.
- La risposta corretta non deve essere sempre nella stessa posizione: distribuire `corretta: 0`, `1`, `2` in modo vario nel file.
- La `spiegazione` deve chiarire *perché* la risposta corretta è giusta **e** perché le altre sono sbagliate, quando utile.
- Usare i backtick per tutto il codice inline, sia nelle domande che nelle spiegazioni.
- Il campo `snippet` è utile quando la domanda ragiona su un blocco di codice specifico; in quel caso iniziare la domanda con "Qual è il risultato di questa espressione?" o simile.

## Struttura del file

```json
[
  { ...domanda1 },
  { ...domanda2 },
  ...
]
```

Il file è un array JSON puro (nessuna chiave radice). Il nome del file diventa il titolo del quiz nel selettore, quindi usare nomi descrittivi in kebab-case (es. `js-map-filter.json`, `css-flexbox.json`).

## Esempio completo

```json
[
  {
    "domanda": "Cosa restituisce `[1, 2, 3].map(x => x * 2)`?",
    "risposte": [
      "`[2, 4, 6]` in un nuovo array",
      "`[1, 4, 9]`",
      "Modifica l'array originale in `[2, 4, 6]`"
    ],
    "corretta": 0,
    "spiegazione": "`map` non modifica l'array originale: crea e restituisce un nuovo array in cui ogni elemento è il risultato della callback. `x => x * 2` moltiplica ogni valore per 2."
  },
  {
    "domanda": "Quale metodo usare per estrarre solo i numeri pari da un array?",
    "snippet": "```js\nconst nums = [1, 2, 3, 4, 5]\n```",
    "risposte": [
      "`nums.map(n => n % 2 === 0)`",
      "`nums.find(n => n % 2 === 0)`",
      "`nums.filter(n => n % 2 === 0)`"
    ],
    "corretta": 2,
    "spiegazione": "`filter` restituisce un nuovo array con solo gli elementi per cui la callback è truthy. `map` trasforma ogni elemento (restituirebbe `[false, true, false, true, false]`). `find` restituisce solo il primo elemento trovato, non un array."
  }
]
```
