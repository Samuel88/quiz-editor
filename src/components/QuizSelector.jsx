import '../styles/QuizSelector.css'

const QuizSelector = ({ onSelectQuiz }) => {
  const quizzes = [
    {
      id: 'css',
      title: 'CSS Basics',
      description: 'Metti alla prova le tue conoscenze sui fondamenti del CSS',
      icon: '🎨',
      color: '#3b82f6',
      topics: ['Selettori', 'Proprietà', 'Box Model', 'Unità di misura']
    },
    {
      id: 'flex',
      title: 'CSS Flexbox',
      description: 'Impara e verifica la tua conoscenza di Flexbox',
      icon: '📐',
      color: '#8b5cf6',
      topics: ['Flex Container', 'Flex Items', 'Alignment', 'Direction']
    },
    {
      id: 'git',
      title: 'Git & Version Control',
      description: 'Verifica le tue competenze su Git e controllo versioni',
      icon: '🔀',
      color: '#f97316',
      topics: ['Commit', 'Branch', 'Merge', 'Remote']
    }
  ]

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
            <p className="quiz-card-description">{quiz.description}</p>

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
