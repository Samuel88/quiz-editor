import { MarkdownHooks as Markdown } from 'react-markdown'
import '../styles/Question.css'

const Inline = ({ children }) => (
  <Markdown disallowedElements={['p']} unwrapDisallowed>{children}</Markdown>
)

const Question = ({ question, onAnswerSelect, selectedAnswer, showFeedback, isCorrect }) => {
  return (
    <div className="question-container">
      <div className="question-text">
        <Markdown>{question.domanda}</Markdown>
      </div>

      {question.snippet && (
        <div className="question-snippet">
          <Markdown>{question.snippet}</Markdown>
        </div>
      )}

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
              <span className="answer-text">
                <Inline>{risposta}</Inline>
              </span>
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
          <div className="feedback-header">
            <span className="feedback-icon">{isCorrect ? '🎉' : '💡'}</span>
            <span>{isCorrect ? 'Risposta corretta!' : 'Risposta errata.'}</span>
          </div>
          {question.spiegazione && (
            <div className="feedback-spiegazione">
              <Markdown>{question.spiegazione}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Question
