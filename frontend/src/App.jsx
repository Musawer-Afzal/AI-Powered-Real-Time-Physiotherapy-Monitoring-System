// App.jsx
import { useState, useEffect } from 'react';
import CameraView from './components/CameraView/CameraView';
import ExerciseSelector from './components/ExerciseSelector/ExerciseSelector';
import FeedbackPanel from './components/FeedbackPanel/FeedbackPanel';
import SessionControls from './components/SessionControls/SessionControls';
import { PoseProvider, usePose } from './contexts/PoseContext';
import { getUpperBodyExercisesByCategory } from './config/exercises/upper-body';
import './App.css';

// Create a main App component that uses PoseContext
function MainApp() {
  const [localExercise, setLocalExercise] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('upper');
  
  // ✅ Get setCurrentExercise from PoseContext
  const { setCurrentExercise: setPoseExercise, resetExercise } = usePose();
  
  const exerciseCategories = {
    upper: {
      name: 'Upper Body',
      subcategories: getUpperBodyExercisesByCategory()
    },
  };

  const handleExerciseSelect = (exerciseId) => {
    console.log('🔄 Selecting exercise:', exerciseId);
    
    // ✅ Update both local state AND PoseContext
    setLocalExercise(exerciseId);
    setPoseExercise(exerciseId);
    
    // Reset any previous session data
    if (sessionActive) {
      setSessionActive(false);
    }
  };

  const handleSessionStart = () => {
    if (localExercise) {
      console.log('🏁 Starting session for:', localExercise);
      setSessionActive(true);
    } else {
      alert('Please select an exercise first');
    }
  };

  const handleSessionStop = () => {
    console.log('⏹️ Stopping session');
    setSessionActive(false);
  };

  const handleSessionReset = () => {
    console.log('🔄 Resetting session');
    setSessionActive(false);
    setLocalExercise(null);
    resetExercise(); // ✅ Reset in PoseContext too
  };

  // Helper function to get session status
  const getSessionStatus = () => {
    if (!localExercise) return 'none';
    if (sessionActive) return 'active';
    return 'ready';
  };

  // Helper function to get session message
  const getSessionMessage = () => {
    if (!localExercise) return '🏠 No Exercise Selected';
    if (sessionActive) return '⏱️ Session Active';
    return '⏸️ Ready to Start';
  };

  // Helper function to format exercise name
  const formatExerciseName = (exerciseId) => {
    if (!exerciseId) return 'None Selected';
    return exerciseId.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-title">
          <h1>AI Physiotherapy Assistant</h1>
          <div className="header-subtitle">
            Professional Rehabilitation Tracking System
          </div>
        </div>
        <div className="header-controls">
          <div className="category-selector">
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setLocalExercise(null); // Clear exercise when category changes
                setPoseExercise(null); // ✅ Also clear in PoseContext
              }}
              className="category-dropdown"
            >
              {Object.entries(exerciseCategories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            className={`debug-toggle ${showDebug ? 'active' : ''}`}
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? '🔧 Debug On' : '🔧 Debug Off'}
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Left Panel - Controls */}
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Select Exercise</h3>
            <div className="category-display">
              <h4>{exerciseCategories[selectedCategory]?.name}</h4>
              <ExerciseSelector
                selectedExercise={localExercise}
                onSelect={handleExerciseSelect}
                disabled={sessionActive}
                category={selectedCategory}
              />
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3>Session Controls</h3>
            <SessionControls
              isActive={sessionActive}
              onStart={handleSessionStart}
              onStop={handleSessionStop}
              onReset={handleSessionReset}
            />
          </div>
          
          <div className="sidebar-section">
            <h3>Session Status</h3>
            <div className="status-info">
              <div className="status-item">
                <span className="status-label">Region:</span>
                <span className="status-value">
                  {exerciseCategories[selectedCategory]?.name}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Exercise:</span>
                <span className="status-value">
                  {formatExerciseName(localExercise)}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Status:</span>
                <span className={`status-value status-${getSessionStatus()}`}>
                  {getSessionStatus() === 'none' ? 'Not Started' : 
                  getSessionStatus() === 'ready' ? 'Ready' : 'Active'}
                </span>
              </div>
            </div>
          </div>
          
          {showDebug && (
            <div className="sidebar-section debug-section">
              <h4>System Info</h4>
              <div className="debug-info">
                <p>Pose Detection: {sessionActive ? 'Active' : 'Standby'}</p>
                <p>Analysis Engine: Ready</p>
                <p>Frame Rate: Optimal</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Area - Camera and Feedback */}
        <div className="main-area">
          <div className="camera-section">
            <div className="section-header">
              <h3>Real-Time Monitoring</h3>
              <div className={`session-timer session-status-${getSessionStatus()}`}>
                {getSessionMessage()}
              </div>
            </div>
            <div className="camera-view-wrapper">
              <CameraView 
                isActive={sessionActive}
                showLandmarks={true}
                showAngles={showDebug}
                currentExercise={localExercise}
              />
            </div>
          </div>
          
          <div className="feedback-section">
            <div className="section-header">
              <h3>Exercise Analysis</h3>
              {localExercise && (
                <div className="exercise-type">
                  {exerciseCategories[selectedCategory]?.name} • {formatExerciseName(localExercise)}
                </div>
              )}
            </div>
            
            {localExercise && sessionActive ? (
              <FeedbackPanel
                exercise={localExercise}
                showDebug={showDebug}
              />
            ) : localExercise ? (
              <div className="ready-message">
                <div className="ready-icon">🎯</div>
                <h3>Ready to Start</h3>
                <p>Exercise <strong>{formatExerciseName(localExercise)}</strong> selected.</p>
                <p>Click "Start Session" to begin analysis.</p>
              </div>
            ) : (
              <div className="welcome-message">
                <div className="welcome-icon">🏋️‍♂️</div>
                <h3>Welcome to PhysioAI</h3>
                <p>Select an exercise from the left panel to begin your rehabilitation session.</p>
                <div className="quick-guide">
                  <h4>How to Use:</h4>
                  <ol>
                    <li>Choose body region from top dropdown</li>
                    <li>Select specific exercise</li>
                    <li>Click "Start Session"</li>
                    <li>Position yourself in camera view</li>
                    <li>Follow on-screen guidance</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap MainApp with PoseProvider
export default function App() {
  return (
    <PoseProvider>
      <MainApp />
    </PoseProvider>
  );
}