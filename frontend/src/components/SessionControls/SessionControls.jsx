import { useTimer } from '../../hooks/useTimer';
import './SessionControls.css';

export default function SessionControls({ isActive, onStart, onStop, onReset }) {
  const { time, reset: resetTimer } = useTimer(isActive);

  const handleReset = () => {
    resetTimer();
    onReset();
  };

  const handleStart = () => {
    if (onStart) {
      onStart();
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  return (
    <div className="session-controls">
      <div className="control-buttons">
        {!isActive ? (
          <button 
            className="control-btn start-btn" 
            onClick={handleStart}
            title="Start exercise session"
          >
            🎬 Start Session
          </button>
        ) : (
          <button 
            className="control-btn stop-btn" 
            onClick={handleStop}
            title="Pause exercise session"
          >
            ⏸️ Pause Session
          </button>
        )}
        
        <button 
          className="control-btn reset-btn" 
          onClick={handleReset}
          title="Reset session and clear exercise"
        >
          🔄 Reset
        </button>
      </div>
      
      <div className="session-status">
        <div className={`status-indicator ${isActive ? 'recording' : 'idle'}`}>
          <span className="status-dot"></span>
          {isActive ? 'Session Active' : 'Session Inactive'}
        </div>
        
        {isActive && (
          <div className="recording-timer">
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{time}</span>
          </div>
        )}
      </div>
    </div>
  );
}