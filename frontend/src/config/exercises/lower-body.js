// Lower body exercises configuration
export const LOWER_BODY_EXERCISES = {
  'straight-leg-raise': {
    id: 'straight-leg-raise',
    name: 'Straight Leg Raise',
    description: 'Lie on your back with one knee bent. Keep the other leg straight and lift it to hip height.',
    difficulty: 'beginner',
    bodyRegion: 'lower',
    joint: 'hip',
    movementType: 'flexion',
    injuryType: 'knee-replacement',
    targetAngles: {
      hip: {
        min: 0,
        max: 60,
        optimal: [45, 60]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'hip',
      minAngle: 20,
      maxAngle: 55,
      direction: 'up-down'
    }
  },
  
  'knee-flexion': {
    id: 'knee-flexion',
    name: 'Knee Flexion',
    description: 'Bend and straighten your knee while seated or lying down.',
    difficulty: 'beginner',
    bodyRegion: 'lower',
    joint: 'knee',
    movementType: 'flexion-extension',
    injuryType: 'knee-replacement',
    targetAngles: {
      knee: {
        min: 0,
        max: 135,
        optimal: [100, 130]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'knee',
      minAngle: 20,
      maxAngle: 125,
      direction: 'bend-straighten'
    }
  },
  
  'hip-abduction': {
    id: 'hip-abduction',
    name: 'Hip Abduction',
    description: 'Lie on your side. Lift your top leg upward while keeping it straight.',
    difficulty: 'beginner',
    bodyRegion: 'lower',
    joint: 'hip',
    movementType: 'abduction',
    injuryType: 'hip-pain',
    targetAngles: {
      hip: {
        min: 0,
        max: 45,
        optimal: [30, 45]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'hip',
      minAngle: 15,
      maxAngle: 40,
      direction: 'up-down'
    }
  }
};

export const getLowerBodyExercisesByCategory = () => {
  return {
    'Hip Exercises': {
      'straight-leg-raise': LOWER_BODY_EXERCISES['straight-leg-raise'],
      'hip-abduction': LOWER_BODY_EXERCISES['hip-abduction']
    },
    'Knee Exercises': {
      'knee-flexion': LOWER_BODY_EXERCISES['knee-flexion']
    }
  };
};

export const getLowerBodyExercise = (id) => {
  return LOWER_BODY_EXERCISES[id] || null;
};