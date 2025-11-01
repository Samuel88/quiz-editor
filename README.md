# Quiz CSS Flexbox

Un'applicazione moderna e interattiva per quiz a risposta multipla, costruita con React e Vite.

## Caratteristiche

- **Design Moderno e Responsive**: Interfaccia elegante che funziona perfettamente su desktop, tablet e mobile
- **Timer per Domanda**: 30 secondi per rispondere a ogni domanda
- **Feedback Visivo Immediato**: Indica immediatamente se la risposta è corretta o errata
- **Barra di Progresso Animata**: Mostra visualmente l'avanzamento nel quiz
- **Sistema di Punteggio**: Calcolo automatico del punteggio con percentuale
- **Storico dei Migliori Punteggi**: Salvataggio locale dei migliori 5 punteggi
- **Riepilogo Dettagliato**: Visualizzazione completa delle risposte con correzioni
- **Shuffle delle Domande**: Ordine casuale delle domande per ogni sessione
- **Animazioni Fluide**: Transizioni ed effetti visivi per un'esperienza utente premium

## Tecnologie Utilizzate

- **React 18**: Framework JavaScript per UI reattive
- **Vite**: Build tool veloce e moderno
- **CSS3**: Styling moderno con variabili CSS, gradient, animazioni
- **LocalStorage**: Persistenza dei punteggi

## Installazione

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Anteprima della build di produzione
npm run preview
```

## Struttura del Progetto

```
quiz-editor/
├── public/
│   └── questions.json          # Database delle domande
├── src/
│   ├── components/
│   │   ├── Question.jsx        # Componente domanda
│   │   ├── Results.jsx         # Componente risultati
│   │   └── ProgressBar.jsx     # Barra di progresso
│   ├── styles/
│   │   ├── index.css           # Stili globali
│   │   ├── App.css             # Stili app principale
│   │   ├── Question.css        # Stili domande
│   │   ├── Results.css         # Stili risultati
│   │   └── ProgressBar.css     # Stili barra progresso
│   ├── App.jsx                 # Componente principale
│   └── main.jsx                # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Formato delle Domande

Le domande sono salvate in `public/questions.json` con questa struttura:

```json
{
  "domanda": "Testo della domanda",
  "risposte": [
    "Prima opzione",
    "Seconda opzione",
    "Terza opzione"
  ],
  "corretta": 0
}
```

## Personalizzazione

### Aggiungere Nuove Domande

Modifica il file `public/questions.json` aggiungendo nuovi oggetti con la struttura sopra indicata.

### Modificare il Timer

Nel file `src/App.jsx`, modifica il valore iniziale del timer:

```javascript
const [timeLeft, setTimeLeft] = useState(30) // Cambia 30 con il valore desiderato
```

### Personalizzare i Colori

I colori sono definiti come variabili CSS in `src/styles/index.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  --success-color: #10b981;
  --error-color: #ef4444;
  /* ... altri colori */
}
```

## Funzionalità Avanzate

### Sistema di Valutazione

- **90-100%**: Eccellente 🏆
- **70-89%**: Buono 👍
- **50-69%**: Sufficiente 📚
- **0-49%**: Da migliorare 💪

### LocalStorage

L'applicazione salva automaticamente:
- Storico dei punteggi
- Data e ora di ogni tentativo
- Percentuale di successo

### Responsive Design

L'interfaccia si adatta perfettamente a:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## Browser Supportati

- Chrome (ultima versione)
- Firefox (ultima versione)
- Safari (ultima versione)
- Edge (ultima versione)

## Licenza

Progetto creato per scopi educativi.

## Crediti

Applicazione sviluppata seguendo le best practices moderne di React e design UX/UI.
