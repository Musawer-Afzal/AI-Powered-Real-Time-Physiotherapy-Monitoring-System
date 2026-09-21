// pages/patient/Exercise.jsx
import { useState, useEffect } from 'react';
import CameraView from '../../components/CameraView/CameraView';
import ExerciseSelector from '../../components/ExerciseSelector/ExerciseSelector';
import SessionControls from '../../components/SessionControls/SessionControls';
import { PoseProvider, usePose } from '../../contexts/PoseContext';
import { useAuth } from '../../contexts/AuthContext';
import LoginPage from "../auth/Login";

import { startSession, finishSession } from "../../connect_services/sessionService";
import * as patientService from "../../connect_services/patientService";
import * as exerciseService from "../../connect_services/exerciseService";

import { 
  UPPER_BODY_EXERCISES,
  getUpperBodyExercisesByCategory, 
  getUpperBodyExercise 
} from '../../config/exercises/upper-body';
import { 
  MID_BODY_EXERCISES,
  getMidBodyExercisesByCategory, 
  getMidBodyExercise 
} from '../../config/exercises/mid-body';
import { 
  LOWER_BODY_EXERCISES,
  getLowerBodyExercisesByCategory, 
  getLowerBodyExercise 
} from '../../config/exercises/lower-body';
import '../../App.css';

const loggedExercises = new Set();

const getExercise = (id) => {
  const upper = getUpperBodyExercise(id);
  if (upper) {
    if (!loggedExercises.has(id)) {
      console.log(`Found ${id} in upper body`);
      loggedExercises.add(id);
    }
    return upper;
  }

  const mid = getMidBodyExercise(id);
  if (mid) {
    if (!loggedExercises.has(id)) {
      console.log(`Found ${id} in mid body`);
      loggedExercises.add(id);
    }
    return mid;
  }

  const lower = getLowerBodyExercise(id);
  if (lower) {
    if (!loggedExercises.has(id)) {
      console.log(`Found ${id} in lower body`);
      loggedExercises.add(id);
    }
    return lower;
  }
  
  console.error('Exercise not found in any category:', id);
  console.log('Available upper body exercises:', Object.keys(UPPER_BODY_EXERCISES || {}));
  console.log('Available mid body exercises:', Object.keys(MID_BODY_EXERCISES || {}));
  console.log('Available lower body exercises:', Object.keys(LOWER_BODY_EXERCISES || {}));
  
  return null;
};

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

function MainApp() {
  const [localExercise, setLocalExercise] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [backendSession, setBackendSession] = useState(null);
  const [showDebug, setShowDebug] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('upper');
  
  const { setCurrentExercise: setPoseExercise, resetExercise, analysis } = usePose();
  
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
    console.log('App.jsx - Selecting exercise:', exerciseId);
    
    const exercise = getExercise(exerciseId);
    if (!exercise) {
      console.error('Exercise not found:', exerciseId);
      return;
    }
    
    setLocalExercise(exerciseId);
    setPoseExercise(exerciseId);
    
    if (sessionActive) {
      setSessionActive(false);
    }
  };

  const handleSessionStart = async () => {
      if (!localExercise) {
          alert("Please select an exercise");
          return;
      }

      try {
          // Resume existing session
          if (backendSession) {
              setSessionActive(true);
              return;
          }

          // Create new session
          const session = await startSession({
              exercise_code: localExercise
          });

          setBackendSession(session);
          setSessionStartTime(Date.now());
          setSessionActive(true);

      } catch (err) {
          console.error(err);
          alert("Could not start session");
      }
  };

  const handleSessionStop = () => {
      setSessionActive(false);
  };

  const handleSessionReset = async () => {
      try {
          // If a backend session exists, save it first
          if (backendSession) {
              const duration = sessionStartTime
                  ? Math.floor((Date.now() - sessionStartTime) / 1000)
                  : 0;

              await finishSession(
                  backendSession.id,
                  {
                      total_reps: analysis?.totalReps ?? 0,
                      good_reps: analysis?.goodReps ?? 0,
                      average_form_score: Number(
                          analysis?.formScore ?? 0
                      ),
                      duration_seconds: duration
                  }
              );
          }
      } catch (err) {
          console.error("Failed to finish session:", err);
      }

      // Always clear frontend state
      setBackendSession(null);
      setSessionStartTime(null);
      setSessionActive(false);
      setLocalExercise(null);
      resetExercise();
  };

  const getSessionStatus = () => {
    if (!localExercise) return 'none';
    if (sessionActive) return 'active';
    return 'ready';
  };

  const getSessionMessage = () => {
    if (!localExercise) return '🏠 No Exercise Selected';
    if (sessionActive) return '⏱️ Session Active';
    return '⏸️ Ready to Start';
  };

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
                setLocalExercise(null);
                setPoseExercise(null);
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
        </div>
      </div>
    </div>
  );
}

export default function Exercise() {
  return <MainApp />;
}