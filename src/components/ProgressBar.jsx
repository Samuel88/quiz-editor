import '../styles/ProgressBar.css'

const ProgressBar = ({ current, total, timeLeft }) => {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="progress-section">
      <div className="progress-info">
        <span className="question-counter">
          Domanda {current + 1} di {total}
        </span>
        <span className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
          ⏱️ {timeLeft}s
        </span>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        >
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
