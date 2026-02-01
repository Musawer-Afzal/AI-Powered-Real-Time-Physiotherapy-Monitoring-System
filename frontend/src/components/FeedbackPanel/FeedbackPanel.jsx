import { usePose } from '../../contexts/PoseContext';
import { EXERCISES } from '../../config/exercises';
import './FeedbackPanel.css';

export default function FeedbackPanel({ exercise }) {
  const { analysis } = usePose();
  const exerciseData = EXERCISES[exercise];

  if (!analysis) {
    return (
      <div className="feedback-panel">
        <div className="feedback-header">
          <h3>Exercise Analysis</h3>
          <div className="session-status">Initializing...</div>
        </div>

        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Starting analysis system...</p>
        </div>
      </div>
    );
  }

  const getFormScoreColor = (score) => {
    if (score >= 90) return '#2ecc71';
    if (score >= 75) return '#f39c12';
    return '#e74c3c';
  };

  const getFormScoreText = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="feedback-panel">
      <div className="feedback-header">
        <h3>{exerciseData?.name || 'Exercise Analysis'}</h3>
        <div className="session-status">
          {analysis.repPhase ? `Phase: ${analysis.repPhase}` : 'Ready'}
        </div>
      </div>

      {/* Compact Stats */}
      <div className="stats-grid">
        <div className="stat-card total-reps-card">
          <div className="stat-value-large">{analysis.totalReps || 0}</div>
          <div className="stat-label">Total Reps</div>
        </div>

        <div className="stat-card form-score-card">
          <div
            className="stat-value-large"
            style={{ color: getFormScoreColor(analysis.formScore || 50) }}
          >
            {analysis.formScore || 50}%
          </div>
          <div className="stat-label">Form Score</div>
          <div className="form-score-text">
            {getFormScoreText(analysis.formScore || 50)}
          </div>
        </div>
      </div>
    </div>
  );
}
