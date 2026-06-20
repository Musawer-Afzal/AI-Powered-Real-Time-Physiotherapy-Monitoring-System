import React, { createContext, useContext, useState, useCallback } from 'react';
import { createExerciseAnalyzer } from '../services/analysis/ExerciseAnalyzer';
import { getExercise } from '../config/exercises/index';

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

    console.log({
      hasLandmarks: !!landmarks,
      hasAnalyzer: !!prev.exerciseAnalyzer,
      currentExercise: prev.currentExercise
    });

    let analysis = null;

    if (prev.exerciseAnalyzer && prev.currentExercise) {
      try {
        analysis = prev.exerciseAnalyzer.analyzeFrame(
          angles,
          Date.now()
        );

        if (
          analysis &&
          analysis.totalReps !== prev.analysis?.totalReps
        ) {
          console.log(
            `🎯 NEW REP COUNTED! Total: ${analysis.totalReps}`
          );
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
    console.log('SET CURRENT EXERCISE CALLED:', exerciseId);

    if (!exerciseId) {
      setState(prev => ({
        ...prev,
        currentExercise: null,
        exerciseAnalyzer: null,
        analysis: null
      }));
      return;
    }

    const exerciseConfig = getExercise(exerciseId);

    if (!exerciseConfig) {
      console.error(`Exercise not found: ${exerciseId}`);
      return;
    }

    const analyzer = createExerciseAnalyzer(exerciseConfig);

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
    console.log('🎯 Target angles:', exerciseConfig.targetAngles);
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
// Enhanced angle calculation for all exercises
function calculateAllAngles(landmarks) {
  const angles = {};
  
  // Shoulder angles (abduction/flexion)
  if (landmarks[11] && landmarks[13] && landmarks[23]) {
    angles.leftShoulder = calculateAngle(landmarks[23], landmarks[11], landmarks[13]);
  }
  if (landmarks[12] && landmarks[14] && landmarks[24]) {
    angles.rightShoulder = calculateAngle(landmarks[24], landmarks[12], landmarks[14]);
  }
  
  // Elbow angles
  if (landmarks[11] && landmarks[13] && landmarks[15]) {
    angles.leftElbow = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);
  }
  if (landmarks[12] && landmarks[14] && landmarks[16]) {
    angles.rightElbow = calculateAngle(landmarks[12], landmarks[14], landmarks[16]);
  }
  
  // Hip angles (for pelvic tilt, bridge, straight leg raise)
  if (landmarks[11] && landmarks[23] && landmarks[25]) {
    angles.leftHip = calculateAngle(landmarks[11], landmarks[23], landmarks[25]);
  }
  if (landmarks[12] && landmarks[24] && landmarks[26]) {
    angles.rightHip = calculateAngle(landmarks[12], landmarks[24], landmarks[26]);
  }
  
  // Hip abduction angle (vertical movement of leg when lying on side)
  // This calculates the angle of the leg relative to vertical
  if (landmarks[23] && landmarks[25] && landmarks[27]) {
    // Left hip abduction: angle between vertical and leg
    angles.leftHipAbduction = calculateHipAbductionAngle(landmarks[23], landmarks[25]);
  }
  if (landmarks[24] && landmarks[26] && landmarks[28]) {
    // Right hip abduction: angle between vertical and leg
    angles.rightHipAbduction = calculateHipAbductionAngle(landmarks[24], landmarks[26]);
  }
  
  // Knee angles
  if (landmarks[23] && landmarks[25] && landmarks[27]) {
    angles.leftKnee = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
  }
  if (landmarks[24] && landmarks[26] && landmarks[28]) {
    angles.rightKnee = calculateAngle(landmarks[24], landmarks[26], landmarks[28]);
  }
  
  // Also calculate average for convenience
  angles.shoulder = (angles.leftShoulder + angles.rightShoulder) / 2;
  angles.hip = (angles.leftHip + angles.rightHip) / 2;
  angles.knee = (angles.leftKnee + angles.rightKnee) / 2;
  angles.elbow = (angles.leftElbow + angles.rightElbow) / 2;
  
  return angles;
}

function calculateHipAbductionAngle(hip, knee) {
  // Calculate the angle of the leg relative to vertical (straight down)
  // This gives us the abduction angle when lying on side
  const dx = knee.x - hip.x;
  const dy = knee.y - hip.y;
  
  // Angle relative to vertical (y-axis)
  // When leg is straight down, angle is 0
  // When leg is lifted sideways, angle increases
  const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
  const angleDeg = angleRad * 180 / Math.PI;
  
  return Math.round(angleDeg);
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