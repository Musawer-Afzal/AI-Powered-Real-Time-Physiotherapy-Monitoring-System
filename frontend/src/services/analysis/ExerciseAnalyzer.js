import { JOINT_CONFIG } from '../../config/joints';

export class ExerciseAnalyzer {
  constructor(exerciseConfig) {
    this.exercise = exerciseConfig;
    this.reset();
    }

  reset() {
    this.state = {
      totalReps: 0,
      goodReps: 0,
      currentRep: 0,
      formScore: 100,
      repPhase: 'resting', // 'resting' -> 'moving' -> 'peak' -> 'returning' -> 'complete'
      repStarted: false,
      repStartTime: null,
      peakAngle: null,
      peakTime: null,
      lastAngle: null,
      angleHistory: [],
      maxHistorySize: 5
    };
    
    return this;
  }

  analyzeFrame(currentAngles, timestamp) {
    if (!currentAngles || Object.keys(currentAngles).length === 0) {
      return this.getCurrentState();
    }

    const primaryAngle = this.getPrimaryAngle(currentAngles);
    if (primaryAngle === null) {
      return this.getCurrentState();
    }

    console.log({
      joint: this.exercise.joint,
      target: this.exercise.targetAngles,
      primaryAngle: primaryAngle
    });
    const smoothedAngle = this.smoothAngle(primaryAngle);
    this.updateRepCounting(smoothedAngle, timestamp);
    this.calculateFormScore(smoothedAngle, currentAngles);
    this.state.lastAngle = smoothedAngle;
    
    return this.getCurrentState();
  }

  getPrimaryAngle(angles) {
    const joint = this.exercise.joint;
    
    // Special case for hip abduction
    if (joint === 'hipAbduction') {
      const leftHipAbduction = angles.leftHipAbduction;
      const rightHipAbduction = angles.rightHipAbduction;

      if (leftHipAbduction !== undefined && rightHipAbduction !== undefined) {
        const result = Math.min(leftHipAbduction,rightHipAbduction);
        return result;
      }

      return leftHipAbduction ?? rightHipAbduction ?? null;
    }
    
    switch (joint) {
      case 'shoulder':
        const leftShoulder = angles.leftShoulder || 0;
        const rightShoulder = angles.rightShoulder || 0;
        return Math.max(leftShoulder, rightShoulder);
        
      case 'elbow':
        const leftElbow = angles.leftElbow || 0;
        const rightElbow = angles.rightElbow || 0;
        return Math.min(leftElbow, rightElbow);
        
      case 'hip':
        const leftHip = angles.leftHip || 0;
        const rightHip = angles.rightHip || 0;
        return Math.max(leftHip, rightHip);
        
      case 'knee':
        const leftKnee = angles.leftKnee || 0;
        const rightKnee = angles.rightKnee || 0;
        return Math.max(leftKnee, rightKnee);
        
      default:
        return null;
    }
  }

  smoothAngle(angle) {
    this.state.angleHistory.push(angle);
    if (this.state.angleHistory.length > this.state.maxHistorySize) {
      this.state.angleHistory.shift();
    }
    
    if (this.state.angleHistory.length === 0) return angle;
    const sum = this.state.angleHistory.reduce((a, b) => a + b, 0);
    return sum / this.state.angleHistory.length;
  }

  updateRepCounting(angle, timestamp) {
    const target = this.exercise.targetAngles?.[this.exercise.joint];
    if (!target) return;

    const { min, max, optimal } = target;
    const optimalMin = optimal?.[0] || Math.min(min, max);
    const optimalMax = optimal?.[1] || Math.max(min, max);
    
    // Determine if angle decreases during the exercise (like bridge, leg raise)
    const isDecreasing = max < min;
    
    // Check if we're in the target range
    const inTargetRange =
      angle >= optimalMin &&
      angle <= optimalMax;
    
    // Determine direction
    let direction = null;
    if (this.state.lastAngle !== null) {
      const change = Math.abs(angle - this.state.lastAngle);
      if (change > 2) {
        direction = angle > this.state.lastAngle ? 'increasing' : 'decreasing';
      }
    }
  
    // Rep counting state machine
    switch (this.state.repPhase) {
      case 'resting':
        if (isDecreasing) {
          // Hip abduction / bridge style movement
          if (
            direction === 'decreasing' &&
            angle < min - 5
          ) {
            this.state.repPhase = 'moving';
            this.state.repStarted = true;
            this.state.repStartTime = timestamp;
            this.state.peakAngle = angle;

            console.log(
              `Rep started at angle: ${Math.round(angle)}°`
            );
          }

        } else {

          // Elbow flexion style movement
          if (
            direction === 'increasing' &&
            angle > min + 5
          ) {
            this.state.repPhase = 'moving';
            this.state.repStarted = true;
            this.state.repStartTime = timestamp;
            this.state.peakAngle = angle;

            console.log(
              `Rep started at angle: ${Math.round(angle)}°`
            );
          }
        }
        break;
        
      case 'moving':
        console.log(
          `MOVING | angle=${Math.round(angle)} | peak=${Math.round(this.state.peakAngle || 0)}`
        );

        // Track peak
        if (isDecreasing) {
          if (angle < this.state.peakAngle) this.state.peakAngle = angle;
        } else {
          if (angle > this.state.peakAngle) this.state.peakAngle = angle;
        }
        
        // Check if reached target
        if (inTargetRange) {
          this.state.repPhase = 'peak';
          this.state.peakTime = timestamp;
        }
        
        // Check if started returning
        if (isDecreasing && direction === 'increasing' && angle > this.state.peakAngle + 5) {
          this.state.repPhase = 'returning';
        } else if (!isDecreasing && direction === 'decreasing' && angle < this.state.peakAngle - 5) {
          this.state.repPhase = 'returning';
        }
        break;
        
      case 'peak':
        // Brief pause, then return
        if (timestamp - this.state.peakTime > 300) {
          this.state.repPhase = 'returning';
        }
        break;
        
      case 'returning':
        // Check if returned to starting position (within 10° of min)
        const returned = isDecreasing 
          ? angle >= min - 10
          : angle <= min + 10;
        console.log({
          phase: 'returning',
          angle: Math.round(angle),
          returned
        });
        if (returned) {
          this.state.repPhase = 'complete';
        }
        break;
        
      case 'complete':
        // Count the rep
        const quality = this.calculateRepQuality();
        if (quality >= 0.7) this.state.goodReps++;
        this.state.totalReps++;
        this.state.currentRep++;
        
        console.log(`Rep ${this.state.totalReps} complete! Peak: ${Math.round(this.state.peakAngle)}°, Quality: ${Math.round(quality * 100)}%`);
        
        // Reset
        this.state.repPhase = 'resting';
        this.state.repStarted = false;
        this.state.peakAngle = null;
        this.state.peakTime = null;
        this.state.repStartTime = null;
        break;
    }
  }

  calculateRepQuality() {
    const target = this.exercise.targetAngles?.[this.exercise.joint];
    if (!target || !this.state.peakAngle) return 0.5;
    
    const { min, max, optimal } = target;
    const optimalMin = optimal?.[0] || Math.min(min, max);
    const optimalMax = optimal?.[1] || Math.max(min, max);
    const isDecreasing = max < min;
    
    // Check if peak is in optimal range
    const inOptimal = isDecreasing
      ? this.state.peakAngle <= optimalMin && this.state.peakAngle >= optimalMax
      : this.state.peakAngle >= optimalMin && this.state.peakAngle <= optimalMax;
    
    const inRange = isDecreasing
      ? this.state.peakAngle <= max
      : this.state.peakAngle >= max;
    
    let peakScore = inOptimal ? 1.0 : (inRange ? 0.7 : 0.3);
    let formScore = this.state.formScore / 100;
    
    return (peakScore * 0.6 + formScore * 0.4);
  }

  calculateFormScore(primaryAngle, allAngles) {
    this.state.formScore = Math.max(50, Math.min(100, this.state.formScore + (Math.random() - 0.5) * 2));
  }

  getCurrentState() {
    const accuracy = this.state.totalReps > 0 ? Math.round((this.state.goodReps / this.state.totalReps) * 100) : 0;
    
    return {
      totalReps: this.state.totalReps,
      goodReps: this.state.goodReps,
      currentRep: this.state.currentRep,
      accuracy: accuracy,
      formScore: Math.round(this.state.formScore),
      repPhase: this.state.repPhase,
      currentFeedback: this.getCurrentFeedback(),
      averageRepQuality: this.state.totalReps > 0 ? this.state.formScore / 100 : 0
    };
  }

  getCurrentFeedback() {
    switch (this.state.repPhase) {
      case 'resting': return this.state.totalReps > 0 ? ['Ready for next rep'] : ['Start moving to begin'];
      case 'moving': return ['Continue the movement'];
      case 'peak': return ['Hold at peak position'];
      case 'returning': return ['Return to starting position'];
      case 'complete': return ['Rep completed!'];
      default: return ['Ready...'];
    }
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