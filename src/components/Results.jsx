import { useState, useEffect } from 'react'
import '../styles/Results.css'

const Results = ({ score, total, onRestart, userAnswers }) => {
  const [highScores, setHighScores] = useState([])
  const percentage = (score / total) * 100

  useEffect(() => {
    // Recupera i migliori punteggi
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]')
    const sorted = scores
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)
    setHighScores(sorted)
  }, [])

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'Eccellente', emoji: '🏆', color: '#4CAF50' }
    if (percentage >= 70) return { grade: 'Buono', emoji: '👍', color: '#2196F3' }
    if (percentage >= 50) return { grade: 'Sufficiente', emoji: '📚', color: '#FF9800' }
    return { grade: 'Da migliorare', emoji: '💪', color: '#F44336' }
  }

  const { grade, emoji, color } = getGrade(percentage)

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="result-emoji">{emoji}</div>
        <h2>Quiz Completato!</h2>
        <div className="score-display">
          <div className="score-circle" style={{ borderColor: color }}>
            <span className="score-number">{score}</span>
            <span className="score-total">/ {total}</span>
          </div>
          <div className="percentage" style={{ color }}>
            {percentage.toFixed(1)}%
          </div>
          <div className="grade" style={{ color }}>
            {grade}
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>Riepilogo Risposte</h3>
        <div className="answers-review">
          {userAnswers.map((answer, index) => (
            <div
              key={index}
              className={`review-item ${answer.isCorrect ? 'correct-item' : 'wrong-item'}`}
            >
              <div className="review-header">
                <span className="review-number">Domanda {index + 1}</span>
                <span className={`review-badge ${answer.isCorrect ? 'badge-correct' : 'badge-wrong'}`}>
                  {answer.isCorrect ? '✓ Corretta' : '✗ Errata'}
                </span>
              </div>
              <p className="review-question">{answer.questionText}</p>
              <div className="review-answers">
                <div className="review-answer your-answer">
                  <strong>La tua risposta:</strong> {answer.selectedText}
                </div>
                {!answer.isCorrect && (
                  <div className="review-answer correct-answer">
                    <strong>Risposta corretta:</strong> {answer.correctText}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {highScores.length > 0 && (
        <div className="high-scores">
          <h3>🏅 Migliori Punteggi</h3>
          <div className="scores-list">
            {highScores.map((scoreItem, index) => (
              <div key={index} className="score-item">
                <span className="rank">#{index + 1}</span>
                <span className="score-value">
                  {scoreItem.score}/{scoreItem.total} ({scoreItem.percentage.toFixed(1)}%)
                </span>
                <span className="score-date">
                  {new Date(scoreItem.date).toLocaleDateString('it-IT')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-actions">
        <button onClick={onRestart} className="restart-button">
          🔄 Ricomincia Quiz
        </button>
      </div>
    </div>
  )
}

export default Results
