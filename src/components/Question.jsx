import '../styles/Question.css'

const Question = ({ question, onAnswerSelect, selectedAnswer, showFeedback, isCorrect }) => {
  return (
    <div className="question-container">
      <h2 className="question-text">{question.domanda}</h2>

      <div className="answers">
        {question.risposte.map((risposta, index) => {
          const isSelected = selectedAnswer === index
          const isCorrectAnswer = index === question.corretta
          const showCorrect = showFeedback && isCorrectAnswer
          const showWrong = showFeedback && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`answer-button ${isSelected ? 'selected' : ''} ${
                showCorrect ? 'correct' : ''
              } ${showWrong ? 'wrong' : ''}`}
            >
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="answer-text">{risposta}</span>
              {showCorrect && (
                <span className="answer-icon">✓</span>
              )}
              {showWrong && (
                <span className="answer-icon">✗</span>
              )}
            </button>
          )
        })}
      </div>

      {showFeedback && (
        <div className={`feedback ${isCorrect ? 'correct-feedback' : 'wrong-feedback'}`}>
          {isCorrect ? (
            <>
              <span className="feedback-icon">🎉</span>
              <span>Risposta corretta!</span>
            </>
          ) : (
            <>
              <span className="feedback-icon">💡</span>
              <span>Risposta errata. La risposta corretta è: {question.risposte[question.corretta]}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Question
