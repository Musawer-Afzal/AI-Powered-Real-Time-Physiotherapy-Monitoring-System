// Mid body (core & spine) exercises configuration
export const MID_BODY_EXERCISES = {
  'pelvic-tilt': {
    id: 'pelvic-tilt',
    name: 'Pelvic Tilt',
    description: 'Lie on your back with knees bent. Flatten your lower back against the floor by tightening your abdominal muscles and tilting your pelvis.',
    difficulty: 'beginner',
    bodyRegion: 'mid',
    joint: 'hip',
    movementType: 'tilt',
    injuryType: 'lower-back-pain',
    targetAngles: {
      hip: {
        min: 160,
        max: 180,
        optimal: [170, 180]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'hip',
      minAngle: 165,
      maxAngle: 180,
      direction: 'tilt-return'
    }
  },
  
  'bridge': {
    id: 'bridge',
    name: 'Supine Bridge',
    description: 'Lie on your back with knees bent. Lift your hips upward while keeping shoulders on the floor.',
    difficulty: 'beginner',
    bodyRegion: 'mid',
    joint: 'hip',
    movementType: 'extension',
    injuryType: 'lower-back-pain',
    targetAngles: {
      hip: {
        min: 160,
        max: 180,
        optimal: [170, 180]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'hip',
      minAngle: 170,
      maxAngle: 180,
      direction: 'up-down'
    }
  }
};

export const getMidBodyExercisesByCategory = () => {
  return {
    'Core & Spine Exercises': {
      'pelvic-tilt': MID_BODY_EXERCISES['pelvic-tilt'],
      'bridge': MID_BODY_EXERCISES['bridge']
    }
  };
};

export const getMidBodyExercise = (id) => {
  return MID_BODY_EXERCISES[id] || null;
};