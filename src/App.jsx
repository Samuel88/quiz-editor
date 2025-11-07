import { useState, useEffect } from 'react'
import Question from './components/Question'
import Results from './components/Results'
import ProgressBar from './components/ProgressBar'
import QuizSelector from './components/QuizSelector'
import './styles/App.css'

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState(null) // null = mostra selector
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Informazioni sui quiz
  const quizInfo = {
    css: {
      title: 'Quiz CSS Basics',
      subtitle: 'Metti alla prova le tue conoscenze sui fondamenti del CSS',
      file: '/questions/css.json'
    },
    flex: {
      title: 'Quiz CSS Flexbox',
      subtitle: 'Metti alla prova le tue conoscenze su Flexbox',
      file: '/questions/flex.json'
    },
    flexBasics: {
      title: 'Quiz Flexbox Basics',
      subtitle: 'Impara i fondamenti di Flexbox',
      file: '/questions/flexbox-basics.json'
    },
    git: {
      title: 'Quiz Git & Version Control',
      subtitle: 'Metti alla prova le tue conoscenze su Git',
      file: '/questions/git.json'
    }
  }

  // Caricamento domande quando viene selezionato un quiz
  useEffect(() => {
    if (!selectedQuiz) return // Non caricare se non è stato selezionato un quiz

    const loadQuestions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(quizInfo[selectedQuiz].file)
        const data = await response.json()

        // Shuffle delle domande per variare l'esperienza
        const shuffled = shuffleArray([...data])
        setQuestions(shuffled)
        setIsLoading(false)
      } catch (error) {
        console.error('Errore nel caricamento delle domande:', error)
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [selectedQuiz])

  // Timer per domanda
  useEffect(() => {
    if (timeLeft > 0 && !showResult && questions.length > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      // Auto-avanza quando scade il tempo
      handleNextQuestion()
    }
  }, [timeLeft, showResult, questions])

  // Funzione per shuffle array (Fisher-Yates)
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Gestione selezione risposta
  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return // Previene cambi dopo la selezione

    setSelectedAnswer(answerIndex)
    const correct = answerIndex === questions[currentQuestion].corretta
    setIsCorrect(correct)
    setShowFeedback(true)
  }

  // Passaggio alla domanda successiva
  const handleNextQuestion = () => {
    // Calcola punteggio
    const correct = selectedAnswer === questions[currentQuestion].corretta
    if (correct) {
      setScore(score + 1)
    }

    // Salva risposta utente
    const newAnswer = {
      questionIndex: currentQuestion,
      questionText: questions[currentQuestion].domanda,
      selected: selectedAnswer,
      selectedText: selectedAnswer !== null ? questions[currentQuestion].risposte[selectedAnswer] : 'Tempo scaduto',
      correct: questions[currentQuestion].corretta,
      correctText: questions[currentQuestion].risposte[questions[currentQuestion].corretta],
      isCorrect: correct
    }

    setUserAnswers([...userAnswers, newAnswer])

    // Passa alla prossima domanda o mostra risultati
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setTimeLeft(30) // Reset timer
    } else {
      setShowResult(true)
      saveScore(score + (correct ? 1 : 0), questions.length)
    }
  }

  // Gestione selezione quiz
  const handleSelectQuiz = (quizId) => {
    setSelectedQuiz(quizId)
    // Reset tutti gli stati
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setUserAnswers([])
    setTimeLeft(30)
    setShowFeedback(false)
  }

  // Cambia quiz (torna alla selezione)
  const handleChangeQuiz = () => {
    setSelectedQuiz(null)
    setQuestions([])
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setUserAnswers([])
    setTimeLeft(30)
    setShowFeedback(false)
  }

  // Restart quiz
  const restartQuiz = () => {
    // Shuffle domande per una nuova esperienza
    const shuffled = shuffleArray([...questions])
    setQuestions(shuffled)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setUserAnswers([])
    setTimeLeft(30)
    setShowFeedback(false)
  }

  // Salvataggio punteggio in localStorage
  const saveScore = (finalScore, total) => {
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]')
    scores.push({
      score: finalScore,
      total,
      date: new Date().toISOString(),
      percentage: (finalScore / total) * 100
    })
    localStorage.setItem('quizScores', JSON.stringify(scores))
  }

  // Mostra il selettore di quiz se non è stato selezionato nessun quiz
  if (!selectedQuiz) {
    return <QuizSelector onSelectQuiz={handleSelectQuiz} />
  }

  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Caricamento quiz...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="error">
          <h2>Errore</h2>
          <p>Impossibile caricare le domande del quiz.</p>
          <button onClick={handleChangeQuiz} className="change-quiz-button">
            Torna alla Selezione
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <div className="header-content">
          <div>
            <h1>{quizInfo[selectedQuiz].title}</h1>
            <p className="subtitle">{quizInfo[selectedQuiz].subtitle}</p>
          </div>
          <button onClick={handleChangeQuiz} className="change-quiz-button" title="Cambia Quiz">
            ← Cambia Quiz
          </button>
        </div>
      </header>

      {!showResult ? (
        <>
          <ProgressBar
            current={currentQuestion}
            total={questions.length}
            timeLeft={timeLeft}
          />

          <Question
            question={questions[currentQuestion]}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />

          <div className="quiz-footer">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`next-button ${selectedAnswer === null ? 'disabled' : ''}`}
            >
              {currentQuestion + 1 === questions.length ? 'Vedi Risultati' : 'Prossima Domanda'}
            </button>
          </div>
        </>
      ) : (
        <Results
          score={score}
          total={questions.length}
          onRestart={restartQuiz}
          userAnswers={userAnswers}
          onChangeQuiz={handleChangeQuiz}
        />
      )}
    </div>
  )
}

export default App
