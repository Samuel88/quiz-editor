import { quizzes } from '../quizzes'
import '../styles/QuizSelector.css'

const QuizSelector = ({ onSelectQuiz }) => {
  return (
    <div className="quiz-selector-container">
      <div className="selector-header">
        <h1 className="selector-title">Scegli il tuo Quiz</h1>
        <p className="selector-subtitle">
          Seleziona l'argomento su cui vuoi metterti alla prova
        </p>
      </div>

      <div className="quiz-cards">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="quiz-card"
            onClick={() => onSelectQuiz(quiz.id)}
            style={{ '--quiz-color': quiz.color }}
          >
            <div className="quiz-card-icon">{quiz.icon}</div>
            <h2 className="quiz-card-title">{quiz.title}</h2>
            <p className="quiz-card-description">{quiz.subtitle}</p>

            <div className="quiz-topics">
              {quiz.topics.map((topic, index) => (
                <span key={index} className="topic-tag">
                  {topic}
                </span>
              ))}
            </div>

            <button className="quiz-card-button">
              Inizia Quiz →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizSelector
