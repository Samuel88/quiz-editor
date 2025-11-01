# Guida Completa: Quiz a Risposta Multipla

## 1. Struttura Dati

### Formato JSON per le Domande
Basandoci sul file `questions.json`, ogni domanda deve seguire questa struttura:

```json
{
    "domanda": "Testo della domanda",
    "risposte": [
        "Prima opzione di risposta",
        "Seconda opzione di risposta",
        "Terza opzione di risposta"
    ],
    "corretta": 0
}
```

**Campi obbligatori:**
- `domanda`: stringa con il testo della domanda
- `risposte`: array di stringhe con le opzioni di risposta
- `corretta`: indice numerico (0-based) della risposta corretta

## 2. Struttura Frontend (React/JavaScript)

### 2.1 Componenti Principali

#### QuizApp (Componente Principale)
```javascript
const QuizApp = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [questions, setQuestions] = useState([]);

    // Logica principale del quiz
}
```

#### Question (Componente Domanda)
```javascript
const Question = ({ question, onAnswerSelect, selectedAnswer }) => {
    return (
        <div className="question-container">
            <h2>{question.domanda}</h2>
            <div className="answers">
                {question.risposte.map((risposta, index) => (
                    <button
                        key={index}
                        onClick={() => onAnswerSelect(index)}
                        className={selectedAnswer === index ? 'selected' : ''}
                    >
                        {risposta}
                    </button>
                ))}
            </div>
        </div>
    );
}
```

#### Results (Componente Risultati)
```javascript
const Results = ({ score, total, onRestart }) => {
    const percentage = (score / total) * 100;

    return (
        <div className="results-container">
            <h2>Quiz Completato!</h2>
            <p>Punteggio: {score}/{total} ({percentage.toFixed(1)}%)</p>
            <button onClick={onRestart}>Ricomincia Quiz</button>
        </div>
    );
}
```

### 2.2 State Management

```javascript
// Stati principali da gestire
const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore] = useState(0);
const [selectedAnswer, setSelectedAnswer] = useState(null);
const [showResult, setShowResult] = useState(false);
const [timeLeft, setTimeLeft] = useState(30); // opzionale: timer
const [userAnswers, setUserAnswers] = useState([]); // tracking risposte
```

## 3. Funzionalità Core

### 3.1 Caricamento Domande
```javascript
useEffect(() => {
    const loadQuestions = async () => {
        try {
            const response = await fetch('/assets/questions.json');
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Errore nel caricamento delle domande:', error);
        }
    };

    loadQuestions();
}, []);
```

### 3.2 Selezione Risposta
```javascript
const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
};
```

### 3.3 Passaggio alla Domanda Successiva
```javascript
const handleNextQuestion = () => {
    // Calcola punteggio
    if (selectedAnswer === questions[currentQuestion].corretta) {
        setScore(score + 1);
    }

    // Salva risposta utente
    setUserAnswers([...userAnswers, {
        question: currentQuestion,
        selected: selectedAnswer,
        correct: questions[currentQuestion].corretta
    }]);

    // Passa alla prossima domanda o mostra risultati
    if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
    } else {
        setShowResult(true);
    }
};
```

### 3.4 Restart Quiz
```javascript
const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setUserAnswers([]);
    setTimeLeft(30);
};
```

## 4. Funzionalità Avanzate

### 4.1 Timer per Domanda
```javascript
useEffect(() => {
    if (timeLeft > 0 && !showResult) {
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
        handleNextQuestion(); // Auto-avanza quando scade il tempo
    }
}, [timeLeft, showResult]);
```

### 4.2 Shuffle delle Domande
```javascript
const shuffleQuestions = (questionsArray) => {
    const shuffled = [...questionsArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
```

### 4.3 Barra di Progresso
```javascript
const ProgressBar = ({ current, total }) => {
    const progress = (current / total) * 100;

    return (
        <div className="progress-container">
            <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
            ></div>
            <span>{current + 1}/{total}</span>
        </div>
    );
};
```

## 5. Styling CSS

### 5.1 Layout Base
```css
.quiz-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.question-container {
    margin-bottom: 30px;
}

.question-container h2 {
    margin-bottom: 20px;
    color: #333;
}
```

### 5.2 Pulsanti Risposta
```css
.answers {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.answers button {
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.answers button:hover {
    border-color: #007bff;
    background: #f8f9fa;
}

.answers button.selected {
    border-color: #007bff;
    background: #007bff;
    color: white;
}
```

### 5.3 Barra di Progresso
```css
.progress-container {
    width: 100%;
    height: 20px;
    background: #f0f0f0;
    border-radius: 10px;
    margin-bottom: 20px;
    position: relative;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #007bff, #0056b3);
    border-radius: 10px;
    transition: width 0.3s ease;
}
```

## 6. Validazione e UX

### 6.1 Validazione Risposta
```javascript
const isAnswerSelected = selectedAnswer !== null;

// Nel JSX
<button
    onClick={handleNextQuestion}
    disabled={!isAnswerSelected}
    className={!isAnswerSelected ? 'disabled' : ''}
>
    {currentQuestion + 1 === questions.length ? 'Termina Quiz' : 'Prossima Domanda'}
</button>
```

### 6.2 Feedback Visivo
```javascript
const [showFeedback, setShowFeedback] = useState(false);

const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    // Nascondi feedback dopo 2 secondi
    setTimeout(() => setShowFeedback(false), 2000);
};
```

## 7. Persistenza Dati

### 7.1 LocalStorage per Punteggi
```javascript
const saveScore = (score, total) => {
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    scores.push({
        score,
        total,
        date: new Date().toISOString(),
        percentage: (score / total) * 100
    });
    localStorage.setItem('quizScores', JSON.stringify(scores));
};

const getHighScores = () => {
    return JSON.parse(localStorage.getItem('quizScores') || '[]')
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);
};
```

## 8. Testing

### 8.1 Test Unitari (Jest)
```javascript
describe('Quiz Logic', () => {
    test('calcola correttamente il punteggio', () => {
        const questions = [
            { corretta: 0 },
            { corretta: 1 },
            { corretta: 2 }
        ];
        const userAnswers = [0, 1, 0];

        const score = calculateScore(questions, userAnswers);
        expect(score).toBe(2);
    });
});
```

### 8.2 Test di Integrazione
```javascript
describe('Quiz Flow', () => {
    test('completa il quiz correttamente', async () => {
        render(<QuizApp />);

        // Seleziona prima risposta
        fireEvent.click(screen.getByText('Prima opzione'));
        fireEvent.click(screen.getByText('Prossima Domanda'));

        // Verifica passaggio alla domanda successiva
        expect(screen.getByText('Domanda 2')).toBeInTheDocument();
    });
});
```

## 9. Ottimizzazioni Performance

### 9.1 Lazy Loading
```javascript
const Results = lazy(() => import('./components/Results'));

// Nel componente principale
<Suspense fallback={<div>Caricamento...</div>}>
    {showResult && <Results score={score} total={questions.length} />}
</Suspense>
```

### 9.2 Memoizzazione
```javascript
const MemoizedQuestion = memo(Question, (prevProps, nextProps) => {
    return prevProps.question.domanda === nextProps.question.domanda &&
           prevProps.selectedAnswer === nextProps.selectedAnswer;
});
```

## 10. Deployment

### 10.1 Build di Produzione
```bash
npm run build
```

### 10.2 File di Configurazione
Assicurarsi che `questions.json` sia nella cartella `public/assets/` per il deployment.

## 11. Estensioni Possibili

- **Categorie di domande**: Raggruppare domande per argomento
- **Difficoltà variabile**: Punteggi diversi in base alla difficoltà
- **Modalità studio**: Mostrare spiegazioni per le risposte
- **Multiplayer**: Quiz competitivi tra utenti
- **Analytics**: Tracking delle performance per domanda
- **Import/Export**: Gestione dinamica delle domande

Questa guida fornisce una base solida per implementare un quiz a risposta multipla completo e professionale.