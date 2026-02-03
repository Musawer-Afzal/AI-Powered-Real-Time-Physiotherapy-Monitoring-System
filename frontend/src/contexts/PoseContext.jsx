import React, { createContext, useContext, useState, useCallback } from 'react';
import { createExerciseAnalyzer } from '../services/analysis/ExerciseAnalyzer';
import { getUpperBodyExercise } from '../config/exercises/upper-body';

const PoseContext = createContext();

const initialState = {
  landmarks: null,
  angles: {},
  isDetecting: false,
  currentExercise: null,
  exerciseAnalyzer: null,
  analysis: null,
  sessionStats: {
    startTime: null,
    totalReps: 0,
    goodReps: 0,
    formScoreHistory: [],
    calories: 0
  }
};

export function PoseProvider({ children }) {
  const [state, setState] = useState(initialState);

  // PoseContext.jsx - Fix the updatePoseData function
// PoseContext.jsx - Update the updatePoseData function
// In the updatePoseData function, add better logging:
const updatePoseData = useCallback((landmarks) => {
  if (!landmarks) return;

  setState(prev => {
    const angles = calculateAllAngles(landmarks);
    let analysis = null;
    
    // If we have an exercise analyzer, analyze the frame
    if (prev.exerciseAnalyzer && prev.currentExercise) {
      try {
        analysis = prev.exerciseAnalyzer.analyzeFrame(angles, Date.now());
        
        // Log rep counting events
        if (analysis.totalReps !== prev.analysis?.totalReps) {
          console.log(`🎯 NEW REP COUNTED! Total: ${analysis.totalReps}`);
        }
        
        // Log form score changes
        if (prev.analysis && Math.abs(analysis.formScore - prev.analysis.formScore) > 5) {
          console.log(`📊 Form score: ${prev.analysis.formScore}% → ${analysis.formScore}%`);
        }
      } catch (error) {
        console.error('❌ Error in analysis:', error);
      }
    }

    return {
      ...prev,
      landmarks,
      angles,
      isDetecting: true,
      analysis: analysis || prev.analysis
    };
  });
}, []);

  const setCurrentExercise = useCallback((exerciseId) => {
    if (!exerciseId) {
      setState(prev => ({
        ...prev,
        currentExercise: null,
        exerciseAnalyzer: null,
        analysis: null
      }));
      return;
    }

    const exerciseConfig = getUpperBodyExercise(exerciseId);
    if (!exerciseConfig) {
      console.error(`Exercise not found: ${exerciseId}`);
      return;
    }

    const analyzer = createExerciseAnalyzer(exerciseConfig);
    
    // Reset the analyzer to start fresh
    analyzer.reset();
    
    setState(prev => ({
      ...prev,
      currentExercise: exerciseId,
      exerciseAnalyzer: analyzer,
      analysis: null,
      sessionStats: {
        ...prev.sessionStats,
        startTime: Date.now(),
        totalReps: 0,
        goodReps: 0,
        formScoreHistory: []
      }
    }));
    
    console.log(`✅ Exercise analyzer created for: ${exerciseConfig.name}`);
    console.log(`🎯 Target angles:`, exerciseConfig.targetAngles);
  }, []);

  const resetExercise = useCallback(() => {
    if (state.exerciseAnalyzer) {
      state.exerciseAnalyzer.reset();
    }
    
    setState(prev => ({
      ...prev,
      analysis: null,
      sessionStats: {
        ...prev.sessionStats,
        totalReps: 0,
        goodReps: 0,
        formScoreHistory: []
      }
    }));
  }, [state.exerciseAnalyzer]);

  const setIsDetecting = useCallback((isDetecting) => {
    setState(prev => ({ ...prev, isDetecting }));
  }, []);

  const value = {
    ...state,
    updatePoseData,
    setCurrentExercise,
    resetExercise,
    setIsDetecting
  };

  return (
    <PoseContext.Provider value={value}>
      {children}
    </PoseContext.Provider>
  );
}

export function usePose() {
  const context = useContext(PoseContext);
  if (!context) {
    throw new Error('usePose must be used within a PoseProvider');
  }
  return context;
}

// Enhanced angle calculation
function calculateAllAngles(landmarks) {
  const angles = {};
  
  // Shoulder angles (abduction/flexion)
  if (landmarks[23] && landmarks[11] && landmarks[13]) {
    angles.leftShoulder = calculateAngle(landmarks[23], landmarks[11], landmarks[13]);
  }
  if (landmarks[24] && landmarks[12] && landmarks[14]) {
    angles.rightShoulder = calculateAngle(landmarks[24], landmarks[12], landmarks[14]);
  }
  
  // Elbow angles
  if (landmarks[11] && landmarks[13] && landmarks[15]) {
    angles.leftElbow = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);
  }
  if (landmarks[12] && landmarks[14] && landmarks[16]) {
    angles.rightElbow = calculateAngle(landmarks[12], landmarks[14], landmarks[16]);
  }
  
  // Hip angles
  if (landmarks[11] && landmarks[23] && landmarks[25]) {
    angles.leftHip = calculateAngle(landmarks[11], landmarks[23], landmarks[25]);
  }
  if (landmarks[12] && landmarks[24] && landmarks[26]) {
    angles.rightHip = calculateAngle(landmarks[12], landmarks[24], landmarks[26]);
  }
  
  // Knee angles
  if (landmarks[23] && landmarks[25] && landmarks[27]) {
    angles.leftKnee = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
  }
  if (landmarks[24] && landmarks[26] && landmarks[28]) {
    angles.rightKnee = calculateAngle(landmarks[24], landmarks[26], landmarks[28]);
  }
  
  // Neck angle (approximation)
  if (landmarks[0] && landmarks[11] && landmarks[23]) {
    angles.neck = calculateAngle(landmarks[0], landmarks[11], landmarks[23]);
  }
  
  // Trunk lean (spine angle)
  if (landmarks[11] && landmarks[23] && landmarks[25]) {
    angles.trunk = calculateAngle(landmarks[11], landmarks[23], landmarks[25]);
  }

  return angles;
}

function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - 
                  Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return Math.round(angle);
}