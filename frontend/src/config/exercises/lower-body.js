export const LOWER_BODY_EXERCISES = {
  'straight-leg-raise': {
    id: 'straight-leg-raise',
    name: 'Straight Leg Raise',
    description: 'Lie on your back with one knee bent (foot flat on floor). Keep the other leg straight and lift it to about 45 degrees.',
    difficulty: 'beginner',
    bodyRegion: 'lower',
    joint: 'hip',
    movementType: 'flexion',
    injuryType: 'knee-replacement',
    targetAngles: {
      hip: {
        min: 175,
        max: 135,
        optimal: [135, 155]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'hip',
      minAngle: 170,
      maxAngle: 145,
      direction: 'up-down'
    }
  },
  
  'knee-flexion': {
    id: 'knee-flexion',
    name: 'Knee Flexion',
    description: 'Lie on your back with leg straight. Slowly bend your knee by sliding your heel toward your buttocks.',
    difficulty: 'beginner',
    bodyRegion: 'lower',
    joint: 'knee',
    movementType: 'flexion-extension',
    injuryType: 'knee-replacement',
    targetAngles: {
      knee: {
        min: 175,
        max: 140,
        optimal: [120, 150]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'knee',
      minAngle: 175,
      maxAngle: 140,
      direction: 'bend-straighten'
    }
  },
  
  'hip-abduction': {
    id: 'hip-abduction',
    name: 'Hip Abduction',
    description: 'Lie on your side with legs straight and stacked. Lift your top leg upward while keeping it straight and body stable.',
    difficulty: 'beginner',
    bodyRegion: 'lower',
    joint: 'hipAbduction',
    movementType: 'abduction',
    injuryType: 'hip-pain',
    targetAngles: {
      hipAbduction: {
        min: 165,
        max: 130,
        optimal: [135, 150]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'hipAbduction',
      minAngle: 165,
      maxAngle: 135,
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