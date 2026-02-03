import { JOINT_CONFIG } from '../../config/joints';

export class ExerciseAnalyzer {
  constructor(exerciseConfig) {
    this.exercise = exerciseConfig;
    this.reset();
    
    console.log(`🏋️‍♂️ Initialized analyzer for: ${exerciseConfig.name}`);
  }

  reset() {
    // Simplified state
    this.state = {
      // Rep counting
      totalReps: 0,
      goodReps: 0,
      currentRep: 0,
      
      // Form tracking
      formScore: 100,
      
      // Rep state machine - SIMPLIFIED
      repPhase: 'resting', // 'resting' -> 'moving_up' -> 'peak' -> 'moving_down' -> 'complete'
      repStarted: false,
      repStartTime: null,
      peakAngle: null,
      peakTime: null,
      
      // Angle tracking
      lastAngle: null,
      angleDirection: null, // 'increasing' or 'decreasing'
      
      // History for smoothing
      angleHistory: [],
      maxHistorySize: 10
    };
    
    return this;
  }

  analyzeFrame(currentAngles, timestamp) {
    if (!currentAngles || Object.keys(currentAngles).length === 0) {
      return this.getCurrentState();
    }

    // Get primary angle for this exercise
    const primaryAngle = this.getPrimaryAngle(currentAngles);
    if (primaryAngle === null) {
      return this.getCurrentState();
    }

    // Smooth the angle
    const smoothedAngle = this.smoothAngle(primaryAngle);
    
    // Update rep counting logic
    this.updateRepCounting(smoothedAngle, timestamp);
    
    // Calculate form score
    this.calculateFormScore(smoothedAngle, currentAngles);
    
    // Store for next frame
    this.state.lastAngle = smoothedAngle;
    
    return this.getCurrentState();
  }

  // Simplified getPrimaryAngle - KEEP YOUR EXISTING WORKING VERSION
  getPrimaryAngle(angles) {
    const joint = this.exercise.joint;
    const movement = this.exercise.movementType;
    
    switch (joint) {
      case 'shoulder':
        if (movement.includes('abduction') || movement.includes('flexion')) {
          // Use average of both shoulders or the more active one
          const left = angles.leftShoulder || 0;
          const right = angles.rightShoulder || 0;
          return Math.max(left, right);
        }
        break;
        
      case 'elbow':
        const leftElbow = angles.leftElbow || 0;
        const rightElbow = angles.rightElbow || 0;
        return Math.max(leftElbow, rightElbow);
        
      case 'knee':
        const leftKnee = angles.leftKnee || 0;
        const rightKnee = angles.rightKnee || 0;
        return Math.max(leftKnee, rightKnee);
        
      default:
        // For other joints, try to find the angle
        const jointKey = Object.keys(angles).find(k => 
          k.toLowerCase().includes(joint.toLowerCase())
        );
        return jointKey ? angles[jointKey] : null;
    }
    
    return null;
  }

  smoothAngle(angle) {
    // Simple moving average
    this.state.angleHistory.push(angle);
    if (this.state.angleHistory.length > this.state.maxHistorySize) {
      this.state.angleHistory.shift();
    }
    
    if (this.state.angleHistory.length === 0) return angle;
    
    const sum = this.state.angleHistory.reduce((a, b) => a + b, 0);
    return sum / this.state.angleHistory.length;
  }

  // SIMPLIFIED REP COUNTING LOGIC
  updateRepCounting(angle, timestamp) {
    const target = this.exercise.targetAngles?.[this.exercise.joint];
    if (!target) return;
    
    const { min, max, optimal } = target;
    const optimalMin = optimal?.[0] || min + (max - min) * 0.6;
    const optimalMax = optimal?.[1] || max - (max - min) * 0.1;
    
    // Determine direction (simplified)
    let direction = null;
    if (this.state.lastAngle !== null) {
      if (angle > this.state.lastAngle + 2) direction = 'increasing';
      else if (angle < this.state.lastAngle - 2) direction = 'decreasing';
      else direction = this.state.angleDirection; // Keep previous direction
    }
    this.state.angleDirection = direction;
    
    // State machine for rep counting
    switch (this.state.repPhase) {
      case 'resting':
        // Start a rep when movement begins significantly
        if (direction && Math.abs(angle - (min || 30)) > 10) {
          this.state.repPhase = 'moving_up';
          this.state.repStarted = true;
          this.state.repStartTime = timestamp;
          this.state.peakAngle = angle;
          console.log(`▶️ Rep started at angle: ${Math.round(angle)}°`);
        }
        break;
        
      case 'moving_up':
        // Update peak angle
        if (angle > this.state.peakAngle) {
          this.state.peakAngle = angle;
        }
        
        // Check if reached peak (starting to slow down or reverse)
        if (direction === 'decreasing' || angle < this.state.peakAngle - 5) {
          // Check if we reached sufficient range
          if (this.state.peakAngle >= optimalMin) {
            this.state.repPhase = 'peak';
            this.state.peakTime = timestamp;
            console.log(`↗️ Peak reached: ${Math.round(this.state.peakAngle)}° (target: ${optimalMin}-${optimalMax}°)`);
          } else {
            // Didn't reach minimum, cancel rep
            this.state.repPhase = 'resting';
            console.log(`❌ Rep cancelled - insufficient range: ${Math.round(this.state.peakAngle)}°`);
          }
        }
        break;
        
      case 'peak':
        // Short pause at peak, then start returning
        if (timestamp - this.state.peakTime > 300) { // 300ms pause
          this.state.repPhase = 'moving_down';
        }
        break;
        
      case 'moving_down':
        // Check if returned to starting position
        if (Math.abs(angle - (min || 30)) < 15) {
          this.state.repPhase = 'complete';
        }
        break;
        
      case 'complete':
        // Count the rep
        const repQuality = this.calculateRepQuality();
        
        if (repQuality >= 0.7) {
          this.state.goodReps++;
        }
        
        this.state.totalReps++;
        this.state.currentRep++;
        
        console.log(`✅ Rep ${this.state.totalReps} completed! Quality: ${Math.round(repQuality * 100)}%`);
        
        // Reset for next rep
        this.state.repPhase = 'resting';
        this.state.repStarted = false;
        this.state.peakAngle = null;
        this.state.peakTime = null;
        break;
    }
  }

  calculateRepQuality() {
    const target = this.exercise.targetAngles?.[this.exercise.joint];
    if (!target || !this.state.peakAngle) return 0.5;
    
    const { min, max, optimal } = target;
    const optimalMin = optimal?.[0] || min + (max - min) * 0.6;
    const optimalMax = optimal?.[1] || max - (max - min) * 0.1;
    
    // Quality based on peak angle
    let peakScore = 0;
    if (this.state.peakAngle >= optimalMin && this.state.peakAngle <= optimalMax) {
      peakScore = 1.0; // Perfect range
    } else if (this.state.peakAngle >= min && this.state.peakAngle <= max) {
      peakScore = 0.7; // Acceptable range
    } else {
      peakScore = 0.3; // Poor range
    }
    
    // Quality based on form score
    const formScore = this.state.formScore / 100;
    
    // Quality based on speed (if we have timing)
    let speedScore = 0.5;
    if (this.state.repStartTime && this.state.peakTime) {
      const upTime = this.state.peakTime - this.state.repStartTime;
      if (upTime > 800 && upTime < 2000) { // 0.8-2.0 seconds is good
        speedScore = 1.0;
      } else if (upTime > 400 && upTime < 3000) { // 0.4-3.0 seconds is acceptable
        speedScore = 0.7;
      } else {
        speedScore = 0.3;
      }
    }
    
    // Weighted average
    return (peakScore * 0.4 + formScore * 0.4 + speedScore * 0.2);
  }

  calculateFormScore(primaryAngle, allAngles) {
    const target = this.exercise.targetAngles?.[this.exercise.joint];
    if (!target) return;
    
    const { min, max, optimal } = target;
    let scoreDelta = 0;
    
    // Check primary angle
    if (primaryAngle < min) {
      scoreDelta -= 15; // Too small
    } else if (primaryAngle > max) {
      scoreDelta -= 15; // Too large
    } else if (optimal && (primaryAngle < optimal[0] || primaryAngle > optimal[1])) {
      scoreDelta -= 5; // Suboptimal but acceptable
    } else if (optimal && primaryAngle >= optimal[0] && primaryAngle <= optimal[1]) {
      scoreDelta += 2; // Optimal - reward good form
    }
    
    // Check for compensatory movements
    scoreDelta += this.checkCompensatoryMovements(allAngles);
    
    // Apply delta with smoothing
    this.state.formScore = Math.max(50, Math.min(100, this.state.formScore + scoreDelta));
  }

  checkCompensatoryMovements(allAngles) {
    let penalty = 0;
    
    // Check shoulder movement during elbow exercises
    if (this.exercise.joint === 'elbow') {
      const leftShoulder = allAngles.leftShoulder || 0;
      const rightShoulder = allAngles.rightShoulder || 0;
      const avgShoulder = (leftShoulder + rightShoulder) / 2;
      
      if (Math.abs(avgShoulder - 20) > 15) {
        penalty -= 3; // Shoulder moving too much
      }
    }
    
    // Check trunk lean during shoulder exercises
    if (this.exercise.joint === 'shoulder') {
      const leftHip = allAngles.leftHip || 90;
      const rightHip = allAngles.rightHip || 90;
      const leftShoulder = allAngles.leftShoulder || 90;
      const rightShoulder = allAngles.rightShoulder || 90;
      
      const trunkLean = Math.abs((leftShoulder + rightShoulder) - (leftHip + rightHip)) / 2;
      if (trunkLean > 10) {
        penalty -= 5; // Leaning too much
      }
    }
    
    return penalty;
  }

  // Simplified getCurrentState
  getCurrentState() {
    const accuracy = this.state.totalReps > 0 ? 
      Math.round((this.state.goodReps / this.state.totalReps) * 100) : 0;
    
    return {
      // Rep counting
      totalReps: this.state.totalReps,
      goodReps: this.state.goodReps,
      currentRep: this.state.currentRep,
      accuracy: accuracy,
      
      // Form analysis
      formScore: Math.round(this.state.formScore),
      repPhase: this.state.repPhase,
      
      // Current feedback based on phase
      currentFeedback: this.getCurrentFeedback(),
      
      // Performance metrics
      averageRepQuality: this.calculateAverageRepQuality()
    };
  }

  getCurrentFeedback() {
    switch (this.state.repPhase) {
      case 'resting':
        return this.state.totalReps > 0 
          ? ['Ready for next rep'] 
          : ['Start moving to begin counting'];
          
      case 'moving_up':
        return ['Continue moving upward'];
        
      case 'peak':
        return ['Hold briefly at peak'];
        
      case 'moving_down':
        return ['Control the downward movement'];
        
      case 'complete':
        return ['Rep completed!'];
        
      default:
        return ['Ready to start...'];
    }
  }

  calculateAverageRepQuality() {
    if (this.state.totalReps === 0) return 0;
    
    // Simplified - use form score as proxy
    return Math.max(0.5, this.state.formScore / 100);
  }

  getSummary() {
    const state = this.getCurrentState();
    return {
      exercise: this.exercise.name,
      totalReps: state.totalReps,
      goodReps: state.goodReps,
      accuracy: state.accuracy,
      averageFormScore: state.formScore,
      averageRepQuality: state.averageRepQuality
    };
  }
}

export function createExerciseAnalyzer(exerciseConfig) {
  return new ExerciseAnalyzer(exerciseConfig);
}