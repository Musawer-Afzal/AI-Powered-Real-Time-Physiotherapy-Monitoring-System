// App.jsx
// App.jsx
import { useState, useEffect } from 'react';
import CameraView from './components/CameraView/CameraView';
import ExerciseSelector from './components/ExerciseSelector/ExerciseSelector';
import SessionControls from './components/SessionControls/SessionControls';
import { PoseProvider, usePose } from './contexts/PoseContext';
import { 
  UPPER_BODY_EXERCISES,
  getUpperBodyExercisesByCategory, 
  getUpperBodyExercise 
} from './config/exercises/upper-body';
import { 
  MID_BODY_EXERCISES,
  getMidBodyExercisesByCategory, 
  getMidBodyExercise 
} from './config/exercises/mid-body';
import { 
  LOWER_BODY_EXERCISES,
  getLowerBodyExercisesByCategory, 
  getLowerBodyExercise 
} from './config/exercises/lower-body';
import './App.css';

// Helper function to get exercise from any category
const loggedExercises = new Set();

const getExercise = (id) => {
  const upper = getUpperBodyExercise(id);
  if (upper) {
    if (!loggedExercises.has(id)) {
      console.log(`✅ Found ${id} in upper body`);
      loggedExercises.add(id);
    }
    return upper;
  }

  const mid = getMidBodyExercise(id);
  if (mid) {
    if (!loggedExercises.has(id)) {
      console.log(`✅ Found ${id} in mid body`);
      loggedExercises.add(id);
    }
    return mid;
  }

  const lower = getLowerBodyExercise(id);
  if (lower) {
    if (!loggedExercises.has(id)) {
      console.log(`✅ Found ${id} in lower body`);
      loggedExercises.add(id);
    }
    return lower;
  }
  
  console.error('❌ Exercise not found in any category:', id);
  console.log('Available upper body exercises:', Object.keys(UPPER_BODY_EXERCISES || {}));
  console.log('Available mid body exercises:', Object.keys(MID_BODY_EXERCISES || {}));
  console.log('Available lower body exercises:', Object.keys(LOWER_BODY_EXERCISES || {}));
  
  return null;
};

// Exercise Info Component
function ExerciseInfo({ exerciseId, exercise }) {
  if (!exercise) return null;
  
  const getDifficultyClass = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      default: return 'difficulty-beginner';
    }
  };
  
  const getDifficultyText = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'Beginner';
    }
  };
  
  // Get angle information based on joint
  const getAngleInfo = () => {
    const targetAngles = exercise.targetAngles;
    const joint = exercise.joint;
    
    if (!targetAngles || !targetAngles[joint]) return null;
    
    const angles = targetAngles[joint];
    return {
      min: angles.min,
      max: angles.max,
      optimal: angles.optimal
    };
  };
  
  const angleInfo = getAngleInfo();
  
  return (
    <div className="exercise-info">
      <div className={`difficulty-badge ${getDifficultyClass(exercise.difficulty)}`}>
        {getDifficultyText(exercise.difficulty)}
      </div>
      <h4>About this exercise</h4>
      <div className="exercise-description">
        {exercise.description}
      </div>
      
      {angleInfo && (
        <div className="angle-info">
          <div className="angle-row">
            <span className="angle-label">Starting Position:</span>
            <span className="angle-values">{angleInfo.min}°</span>
          </div>
          <div className="angle-row">
            <span className="angle-label">Ending Position:</span>
            <span className="angle-values">{angleInfo.max}°</span>
          </div>
          {angleInfo.optimal && (
            <div className="angle-row">
              <span className="angle-label">Optimal Range:</span>
              <span className="angle-values angle-optimal">
                {angleInfo.optimal[0]}° - {angleInfo.optimal[1]}°
              </span>
            </div>
          )}
          <div className="angle-row">
            <span className="angle-label">Movement:</span>
            <span className="angle-values">{exercise.movementType}</span>
          </div>
          {exercise.injuryType && (
            <div className="angle-row">
              <span className="angle-label">Common for:</span>
              <span className="angle-values">{exercise.injuryType.replace(/-/g, ' ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Create a main App component that uses PoseContext
function MainApp() {
  const [localExercise, setLocalExercise] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('upper');
  
  // Get setCurrentExercise from PoseContext
  const { setCurrentExercise: setPoseExercise, resetExercise } = usePose();
  
  const exerciseCategories = {
    upper: {
      name: 'Upper Body',
      subcategories: getUpperBodyExercisesByCategory()
    },
    mid: {
      name: 'Mid Body (Core & Spine)',
      subcategories: getMidBodyExercisesByCategory()
    },
    lower: {
      name: 'Lower Body',
      subcategories: getLowerBodyExercisesByCategory()
    }
  };

  const handleExerciseSelect = (exerciseId) => {
    console.log('🔄 App.jsx - Selecting exercise:', exerciseId);
    
    // Verify exercise exists
    const exercise = getExercise(exerciseId);
    if (!exercise) {
      console.error('Exercise not found:', exerciseId);
      return;
    }
    
    // Update both local state AND PoseContext
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
    resetExercise(); // Reset in PoseContext too
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
    const exercise = getExercise(exerciseId);
    if (exercise) return exercise.name;
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
                setPoseExercise(null); // Also clear in PoseContext
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
          <div className={`sidebar-section ${localExercise ? 'has-exercise' : ''}`}>
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
            
            {/* Exercise Info Display */}
            {localExercise && (
              <ExerciseInfo 
                exerciseId={localExercise} 
                exercise={getExercise(localExercise)}
              />
            )}
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
              <div className="performance-summary">
                <div className="ready-message">
                  <div className="ready-icon">📊</div>
                  <h3>Live Analysis Active</h3>
                  <p>Real-time performance tracking is now displayed in the camera panel.</p>
                  <p>Check the right panel for <strong>Total Reps</strong> and <strong>Form Score</strong>.</p>
                </div>
              </div>
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