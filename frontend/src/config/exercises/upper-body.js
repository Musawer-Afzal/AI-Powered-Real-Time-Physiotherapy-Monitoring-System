// Upper body exercises configuration
export const UPPER_BODY_EXERCISES = {
  'shoulder-pendulum': {
    id: 'shoulder-pendulum',
    name: 'Shoulder Pendulum',
    description: 'Gentle passive shoulder mobilization. Lean forward supporting yourself with one hand, let the other arm hang down and swing gently in small circles.',
    difficulty: 'beginner',
    bodyRegion: 'upper',
    joint: 'shoulder',
    movementType: 'circumduction',
    injuryType: 'frozen-shoulder',
    targetAngles: {
      shoulder: {
        min: 0,
        max: 30,
        optimal: [15, 25]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'shoulder',
      minAngle: 5,
      maxAngle: 30,
      direction: 'circular'
    }
  },
  
  'shoulder-flexion': {
    id: 'shoulder-flexion',
    name: 'Shoulder Flexion',
    description: 'Raise arm forward and upward while keeping elbow straight.',
    difficulty: 'beginner',
    bodyRegion: 'upper',
    joint: 'shoulder',
    movementType: 'flexion',
    injuryType: 'rotator-cuff',
    targetAngles: {
      shoulder: {
        min: 0,
        max: 180,
        optimal: [150, 180]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'shoulder',
      minAngle: 30,
      maxAngle: 160,
      direction: 'up-down'
    }
  },
  
  'shoulder-abduction': {
    id: 'shoulder-abduction',
    name: 'Shoulder Abduction',
    description: 'Raise arm sideways to shoulder height.',
    difficulty: 'beginner',
    bodyRegion: 'upper',
    joint: 'shoulder',
    movementType: 'abduction',
    injuryType: 'rotator-cuff',
    targetAngles: {
      shoulder: {
        min: 0,
        max: 90,
        optimal: [75, 90]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'shoulder',
      minAngle: 20,
      maxAngle: 85,
      direction: 'up-down'
    }
  },
  
  'elbow-flexion': {
    id: 'elbow-flexion',
    name: 'Elbow Flexion',
    description: 'Bend and straighten your elbow while keeping shoulder stable.',
    difficulty: 'beginner',
    bodyRegion: 'upper',
    joint: 'elbow',
    movementType: 'flexion-extension',
    injuryType: 'tennis-elbow',
    targetAngles: {
      elbow: {
        min: 20,
        max: 150,
        optimal: [70, 140]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'elbow',
      minAngle: 30,
      maxAngle: 140,
      direction: 'bend-straighten'
    }
  }
};

// Get exercises by category (for backward compatibility)
export const getUpperBodyExercisesByCategory = () => {
  return {
    'Shoulder Exercises': {
      'shoulder-pendulum': UPPER_BODY_EXERCISES['shoulder-pendulum'],
      'shoulder-flexion': UPPER_BODY_EXERCISES['shoulder-flexion'],
      'shoulder-abduction': UPPER_BODY_EXERCISES['shoulder-abduction']
    },
    'Elbow Exercises': {
      'elbow-flexion': UPPER_BODY_EXERCISES['elbow-flexion']
    }
  };
};

export const getUpperBodyExercise = (id) => {
  return UPPER_BODY_EXERCISES[id] || null;
};