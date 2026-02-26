# Quiz App

Applicazione React per quiz a risposta multipla, con timer, feedback immediato e riepilogo finale.

## Avvio

```bash
pnpm install
pnpm dev
```

L'app sarà disponibile su `http://localhost:5173`.

## Struttura del progetto

```
quiz-editor/
├── public/
│   └── questions/          # File JSON delle domande (uno per quiz)
│       ├── intro.json
│       ├── css.json
│       ├── flex.json
│       ├── flexbox-basics.json
│       └── git.json
├── src/
│   ├── quizzes.js          # Configurazione centralizzata dei quiz ← unico file da toccare
│   ├── components/
│   │   ├── QuizSelector.jsx
│   │   ├── Question.jsx
│   │   ├── Results.jsx
│   │   └── ProgressBar.jsx
│   ├── styles/
│   └── App.jsx
└── index.html
```

## Aggiungere un nuovo quiz

### 1. Creare il file delle domande

Aggiungere un file JSON in `public/questions/`, ad esempio `public/questions/html.json`:

```json
[
  {
    "domanda": "Cosa significa HTML?",
    "risposte": [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyperlink and Text Markup Language"
    ],
    "corretta": 0
  }
]
```

- `domanda`: testo della domanda
- `risposte`: array di opzioni (minimo 2)
- `corretta`: indice (0-based) della risposta corretta

### 2. Registrare il quiz in `src/quizzes.js`

Aggiungere un oggetto all'array `quizzes`:

```js
{
  id: 'html',
  title: 'Quiz HTML Basics',
  subtitle: 'Metti alla prova le tue conoscenze su HTML',
  file: '/questions/html.json',
  icon: '📄',
  color: '#e34c26',
  topics: ['Tag', 'Attributi', 'Semantica', 'Forms']
}
```

Questo è l'unico file da modificare: il quiz comparirà automaticamente nella schermata di selezione.
