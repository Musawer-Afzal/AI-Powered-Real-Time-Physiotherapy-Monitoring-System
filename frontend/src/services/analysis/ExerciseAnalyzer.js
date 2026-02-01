import { JOINT_CONFIG } from '../../config/joints';

export class ExerciseAnalyzer {
  constructor(exerciseConfig) {
    this.exercise = exerciseConfig;
    this.reset();
    
    console.log(`🏋️‍♂️ Initialized analyzer for: ${exerciseConfig.name}`);
  }

  reset() {
    this.state = {
      // Session stats
      sessionStartTime: Date.now(),
      totalReps: 0,
      goodReps: 0,
      currentRep: 0,
      
      // Form tracking
      formScore: 100,
      currentStreak: 0,
      bestStreak: 0,
      
      // Rep state machine
      repPhase: 'resting', // resting → starting → peak → returning → complete
      direction: null,     // 'increasing' or 'decreasing'
      peakAngle: null,
      repStartTime: null,
      
      // Angle history for smoothing
      angleHistory: [],
      lastAngles: {},
      
      // Feedback
      feedbackHistory: [],
      currentFeedback: [],
      lastFeedbackTime: 0
    };
    
    return this;
  }

  analyzeFrame(currentAngles, timestamp) {
    if (!currentAngles || Object.keys(currentAngles).length === 0) {
      return this.getCurrentState();
    }

    // Update angle history for smoothing
    this.updateAngleHistory(currentAngles);
    
    // Get smoothed angles
    const smoothedAngles = this.getSmoothedAngles();
    
    // Get primary angle for this exercise
    const primaryAngle = this.getPrimaryAngle(smoothedAngles);
    if (primaryAngle === null) {
      this.state.currentFeedback = ['Waiting for joint detection...'];
      return this.getCurrentState();
    }

    // Exercise-specific analysis
    const analysis = this.performExerciseAnalysis(primaryAngle, smoothedAngles, timestamp);
    
    // Update state with analysis results
    this.updateState(analysis, smoothedAngles, timestamp);
    
    return this.getCurrentState();
  }

  // ExerciseAnalyzer.js - Update getPrimaryAngle method
getPrimaryAngle(angles) {
  const joint = this.exercise.joint;
  const movement = this.exercise.movementType;
  
  console.log('🎯 Getting primary angle for:', {
    exercise: this.exercise.name,
    joint: joint,
    movement: movement,
    availableAngles: Object.keys(angles)
  });
  
  switch (joint) {
    case 'shoulder':
      if (movement.includes('abduction') || movement.includes('flexion')) {
        // Use average of both shoulders or the more active one
        const left = angles.leftShoulder || 0;
        const right = angles.rightShoulder || 0;
        const primary = Math.max(left, right);
        console.log('👕 Shoulder angles - Left:', left, 'Right:', right, 'Primary:', primary);
        return primary;
      }
      break;
      
    case 'elbow':
      const leftElbow = angles.leftElbow || 0;
      const rightElbow = angles.rightElbow || 0;
      const elbowPrimary = Math.max(leftElbow, rightElbow);
      console.log('💪 Elbow angles - Left:', leftElbow, 'Right:', rightElbow, 'Primary:', elbowPrimary);
      return elbowPrimary;
      
    case 'knee':
      const leftKnee = angles.leftKnee || 0;
      const rightKnee = angles.rightKnee || 0;
      const kneePrimary = Math.max(leftKnee, rightKnee);
      console.log('🦵 Knee angles - Left:', leftKnee, 'Right:', rightKnee, 'Primary:', kneePrimary);
      return kneePrimary;
      
    default:
      // For other joints, try to find the angle
      const jointKey = Object.keys(angles).find(k => 
        k.toLowerCase().includes(joint.toLowerCase())
      );
      const value = jointKey ? angles[jointKey] : null;
      console.log('🔍 Other joint search:', { joint, jointKey, value });
      return value;
  }
  
  console.log('❌ No primary angle found');
  return null;
}

  performExerciseAnalysis(primaryAngle, allAngles, timestamp) {
    const analysis = {
      shouldCountRep: false,
      isValidForm: true,
      feedback: [],
      warnings: [],
      formScoreDelta: 0
    };

    // 1. Form validation
    this.validateForm(primaryAngle, allAngles, analysis);
    
    // 2. Phase detection based on exercise type
    this.detectPhase(primaryAngle, timestamp, analysis);
    
    // 3. Generate feedback
    this.generateFeedback(primaryAngle, analysis);
    
    // 4. Check for rep completion
    this.checkRepCompletion(primaryAngle, timestamp, analysis);

    return analysis;
  }

  validateForm(primaryAngle, allAngles, analysis) {
    const target = this.exercise.targetAngles?.[this.exercise.joint];
    if (!target) return;

    // Check if angle is within safe range
    if (primaryAngle < target.min) {
      analysis.feedback.push(`Angle too small (${primaryAngle}° < ${target.min}°). Increase range.`);
      analysis.isValidForm = false;
      analysis.formScoreDelta -= 10;
    } else if (primaryAngle > target.max) {
      analysis.feedback.push(`Angle too large (${primaryAngle}° > ${target.max}°). Decrease range.`);
      analysis.isValidForm = false;
      analysis.formScoreDelta -= 10;
    }

    // Check optimal range
    if (target.optimal) {
      const [optimalMin, optimalMax] = target.optimal;
      if (primaryAngle < optimalMin) {
        analysis.feedback.push(`Could increase slightly for optimal form`);
        analysis.formScoreDelta -= 5;
      } else if (primaryAngle > optimalMax) {
        analysis.feedback.push(`Could decrease slightly for optimal form`);
        analysis.formScoreDelta -= 5;
      }
    }

    // Check for compensatory movements
    this.checkCompensatoryMovements(allAngles, analysis);
  }

  checkCompensatoryMovements(allAngles, analysis) {
    // Check for shoulder elevation during elbow exercises
    if (this.exercise.joint === 'elbow') {
      const shoulderAngle = allAngles.leftShoulder || allAngles.rightShoulder || 0;
      if (Math.abs(shoulderAngle - 20) > 15) {
        analysis.warnings.push('Keep shoulder still during movement');
        analysis.formScoreDelta -= 3;
      }
    }
    
    // Check for trunk lean during shoulder exercises
    if (this.exercise.joint === 'shoulder') {
      const leftHip = allAngles.leftHip || 90;
      const rightHip = allAngles.rightHip || 90;
      const leftShoulder = allAngles.leftShoulder || 90;
      const rightShoulder = allAngles.rightShoulder || 90;
      
      const trunkLean = Math.abs((leftShoulder + rightShoulder) - (leftHip + rightHip)) / 2;
      if (trunkLean > 10) {
        analysis.warnings.push('Keep torso upright, avoid leaning');
        analysis.formScoreDelta -= 5;
      }
    }
    
    // Check speed (if we have history)
    if (this.state.angleHistory.length > 5) {
      const speed = this.calculateMovementSpeed();
      if (speed > 120) { // degrees per second
        analysis.warnings.push('Slow down for better control');
        analysis.formScoreDelta -= 3;
      } else if (speed < 20 && this.state.repPhase !== 'resting') {
        analysis.warnings.push('Speed up slightly for better fluidity');
        analysis.formScoreDelta -= 2;
      }
    }
  }

  detectPhase(angle, timestamp, analysis) {
    const { repCounting } = this.exercise;
    if (!repCounting) return;

    const previousPhase = this.state.repPhase;
    
    switch (repCounting.type) {
      case 'range':
        this.detectRangePhase(angle, timestamp, analysis);
        break;
        
      case 'threshold':
        this.detectThresholdPhase(angle, timestamp, analysis);
        break;
        
      case 'gentle':
        this.detectGentlePhase(angle, timestamp, analysis);
        break;
    }

    // Phase changed - provide feedback
    if (this.state.repPhase !== previousPhase) {
      this.onPhaseChange(previousPhase, this.state.repPhase, analysis);
    }
  }

  detectRangePhase(angle, timestamp, analysis) {
    const { phases } = this.exercise.repCounting;
    const target = this.exercise.targetAngles?.[this.exercise.joint];
    
    switch (this.state.repPhase) {
      case 'resting':
        // Check if movement has started
        if (angle > phases.start.angle) {
          this.state.repPhase = 'starting';
          this.state.direction = phases.start.direction;
          this.state.repStartTime = timestamp;
          analysis.feedback.push('Starting movement...');
        }
        break;
        
      case 'starting':
        // Check if reached significant movement
        if (angle > phases.mid.angle) {
          this.state.repPhase = 'mid';
          analysis.feedback.push('Good range!');
        }
        break;
        
      case 'mid':
        // Check for peak or direction change
        if (this.state.direction === 'increasing' && angle < this.state.peakAngle - 10) {
          // Starting to return
          this.state.repPhase = 'returning';
          this.state.direction = 'decreasing';
        } else if (this.state.direction === 'decreasing' && angle > this.state.peakAngle + 10) {
          // Starting to extend
          this.state.repPhase = 'returning';
          this.state.direction = 'increasing';
        }
        
        // Update peak angle
        if (!this.state.peakAngle || 
            (this.state.direction === 'increasing' && angle > this.state.peakAngle) ||
            (this.state.direction === 'decreasing' && angle < this.state.peakAngle)) {
          this.state.peakAngle = angle;
        }
        break;
        
      case 'returning':
        // Check if returned to starting position
        if (Math.abs(angle - target.resting) < 15) {
          this.state.repPhase = 'completing';
        }
        break;
        
      case 'completing':
        // Ready to count rep
        this.state.repPhase = 'resting';
        analysis.shouldCountRep = true;
        break;
    }
  }

  detectThresholdPhase(angle, timestamp, analysis) {
    const threshold = this.exercise.repCounting.threshold;
    
    if (!this.state.peakAngle) {
      this.state.peakAngle = angle;
    }

    if (angle > threshold && !this.state.inThresholdZone) {
      this.state.inThresholdZone = true;
      analysis.feedback.push('Threshold reached');
    } else if (angle < threshold - 20 && this.state.inThresholdZone) {
      this.state.inThresholdZone = false;
      
      // Check if peak was sufficient
      if (this.state.peakAngle > threshold + 10) {
        analysis.shouldCountRep = true;
        analysis.feedback.push('Good rep!');
      }
      
      this.state.peakAngle = null;
    }

    // Update peak
    if (angle > this.state.peakAngle) {
      this.state.peakAngle = angle;
    }
  }

  checkRepCompletion(angle, timestamp, analysis) {
    if (analysis.shouldCountRep) {
      // Validate rep quality
      const repQuality = this.calculateRepQuality(timestamp);
      
      if (repQuality >= 0.7 && analysis.isValidForm) {
        this.state.goodReps++;
        this.state.currentStreak++;
        this.state.bestStreak = Math.max(this.state.bestStreak, this.state.currentStreak);
        analysis.feedback.push(`Perfect rep! (Streak: ${this.state.currentStreak})`);
      } else {
        this.state.currentStreak = 0;
        analysis.feedback.push('Rep counted - work on form');
      }
      
      this.state.totalReps++;
      this.state.currentRep++;
      
      // Reset rep state
      this.state.repPhase = 'resting';
      this.state.peakAngle = null;
      this.state.repStartTime = null;
    }
  }

  calculateRepQuality(timestamp) {
    if (!this.state.repStartTime) return 0.5;
    
    const duration = timestamp - this.state.repStartTime;
    const idealDuration = this.exercise.repCounting?.idealDuration || 2000;
    
    // Quality based on duration (not too fast, not too slow)
    const durationScore = Math.max(0, 1 - Math.abs(duration - idealDuration) / idealDuration);
    
    // Quality based on form score
    const formScore = this.state.formScore / 100;
    
    // Quality based on peak angle
    const target = this.exercise.targetAngles?.[this.exercise.joint];
    let peakScore = 0.5;
    if (target && this.state.peakAngle) {
      if (target.optimal) {
        const [min, max] = target.optimal;
        if (this.state.peakAngle >= min && this.state.peakAngle <= max) {
          peakScore = 1.0;
        } else if (this.state.peakAngle >= target.min && this.state.peakAngle <= target.max) {
          peakScore = 0.8;
        }
      }
    }
    
    return (durationScore * 0.3 + formScore * 0.4 + peakScore * 0.3);
  }

  generateFeedback(angle, analysis) {
    // Add warnings if any
    analysis.feedback.push(...analysis.warnings);
    
    // Provide phase-specific guidance
    switch (this.state.repPhase) {
      case 'starting':
        analysis.feedback.push('Continue through full range');
        break;
      case 'mid':
        analysis.feedback.push('Hold briefly at peak');
        break;
      case 'returning':
        analysis.feedback.push('Control the return movement');
        break;
    }
    
    // Add instructional cues occasionally
    if (Math.random() < 0.1 && this.exercise.instructions?.cues) {
      const randomCue = this.exercise.instructions.cues[
        Math.floor(Math.random() * this.exercise.instructions.cues.length)
      ];
      if (!analysis.feedback.includes(randomCue)) {
        analysis.feedback.push(randomCue);
      }
    }
  }

  onPhaseChange(oldPhase, newPhase, analysis) {
    const phaseMessages = {
      'resting→starting': 'Begin movement',
      'starting→mid': 'Good range of motion',
      'mid→returning': 'Start returning',
      'returning→completing': 'Almost complete',
      'completing→resting': 'Ready for next rep'
    };
    
    const key = `${oldPhase}→${newPhase}`;
    if (phaseMessages[key]) {
      analysis.feedback.push(phaseMessages[key]);
    }
  }

  updateAngleHistory(currentAngles) {
    this.state.angleHistory.push({
      timestamp: Date.now(),
      angles: { ...currentAngles }
    });
    
    // Keep last 30 frames (about 1 second at 30fps)
    if (this.state.angleHistory.length > 30) {
      this.state.angleHistory.shift();
    }
    
    this.state.lastAngles = currentAngles;
  }

  getSmoothedAngles() {
    if (this.state.angleHistory.length < 3) {
      return this.state.lastAngles || {};
    }
    
    // Simple moving average over last 3 frames
    const recentFrames = this.state.angleHistory.slice(-3);
    const smoothed = {};
    
    // Average each angle
    Object.keys(recentFrames[0].angles).forEach(joint => {
      const sum = recentFrames.reduce((acc, frame) => acc + (frame.angles[joint] || 0), 0);
      smoothed[joint] = Math.round(sum / recentFrames.length);
    });
    
    return smoothed;
  }

  calculateMovementSpeed() {
    if (this.state.angleHistory.length < 2) return 0;
    
    const primaryAngle = this.getPrimaryAngle(this.state.angleHistory[this.state.angleHistory.length - 1].angles);
    const prevPrimaryAngle = this.getPrimaryAngle(this.state.angleHistory[0].angles);
    
    if (primaryAngle === null || prevPrimaryAngle === null) return 0;
    
    const timeDiff = this.state.angleHistory[this.state.angleHistory.length - 1].timestamp - 
                    this.state.angleHistory[0].timestamp;
    
    if (timeDiff === 0) return 0;
    
    const angleDiff = Math.abs(primaryAngle - prevPrimaryAngle);
    return (angleDiff / timeDiff) * 1000; // degrees per second
  }

  updateState(analysis, currentAngles, timestamp) {
    // Update form score (clamped between 50-100)
    this.state.formScore = Math.max(50, Math.min(100, 
      this.state.formScore + analysis.formScoreDelta
    ));
    
    // Update feedback history
    if (analysis.feedback.length > 0) {
      const feedbackEntry = {
        timestamp,
        messages: [...analysis.feedback],
        phase: this.state.repPhase,
        formScore: this.state.formScore
      };
      
      this.state.feedbackHistory.push(feedbackEntry);
      this.state.currentFeedback = analysis.feedback;
      
      // Keep only last 20 feedback entries
      if (this.state.feedbackHistory.length > 20) {
        this.state.feedbackHistory.shift();
      }
    }
    
    // Store last feedback time
    if (analysis.feedback.length > 0) {
      this.state.lastFeedbackTime = timestamp;
    }
  }

  // ExerciseAnalyzer.js - Update getCurrentState method
getCurrentState() {
  // Ensure we have valid values
  const totalReps = this.state.totalReps || 0;
  const goodReps = this.state.goodReps || 0;
  const accuracy = totalReps > 0 ? 
    Math.round((goodReps / totalReps) * 100) : 0;
  
  const sessionDuration = Date.now() - this.state.sessionStartTime;
  const minutes = Math.floor(sessionDuration / 60000);
  const seconds = Math.floor((sessionDuration % 60000) / 1000);
  
  const formScore = Math.max(50, Math.min(100, this.state.formScore || 100));
  
  return {
    // Rep counting
    totalReps: totalReps,
    goodReps: goodReps,
    currentRep: this.state.currentRep || 0,
    accuracy: accuracy,
    
    // Form analysis
    formScore: Math.round(formScore),
    currentStreak: this.state.currentStreak || 0,
    bestStreak: this.state.bestStreak || 0,
    
    // Current state
    repPhase: this.state.repPhase || 'resting',
    currentFeedback: Array.isArray(this.state.currentFeedback) && this.state.currentFeedback.length > 0 ? 
      this.state.currentFeedback : ['Ready to start...'],
    
    // Session info
    sessionDuration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    repRate: minutes > 0 ? (totalReps / minutes).toFixed(1) : 0,
    
    // Performance metrics
    averageRepQuality: this.calculateAverageRepQuality(),
    consistency: this.calculateConsistency()
  };
}

  calculateAverageRepQuality() {
    // Simplified - could be enhanced with actual rep quality tracking
    const baseQuality = this.state.formScore / 100;
    const streakBonus = this.state.currentStreak * 0.05;
    return Math.min(1.0, baseQuality + streakBonus);
  }

  calculateConsistency() {
    if (this.state.totalReps < 3) return 0;
    
    // Calculate variance in form scores (simplified)
    const recentScores = this.state.feedbackHistory
      .slice(-10)
      .map(f => f.formScore);
    
    if (recentScores.length < 2) return 100;
    
    const average = recentScores.reduce((a, b) => a + b) / recentScores.length;
    const variance = recentScores.reduce((a, b) => a + Math.pow(b - average, 2), 0) / recentScores.length;
    
    // Convert to percentage (lower variance = higher consistency)
    return Math.max(0, 100 - (variance * 2));
  }

  getSummary() {
    const state = this.getCurrentState();
    return {
      exercise: this.exercise.name,
      sessionStart: new Date(this.state.sessionStartTime).toISOString(),
      duration: state.sessionDuration,
      totalReps: state.totalReps,
      goodReps: state.goodReps,
      accuracy: state.accuracy,
      averageFormScore: state.formScore,
      bestStreak: state.bestStreak,
      averageRepQuality: state.averageRepQuality,
      consistency: state.consistency
    };
  }
}

export function createExerciseAnalyzer(exerciseConfig) {
  return new ExerciseAnalyzer(exerciseConfig);
}