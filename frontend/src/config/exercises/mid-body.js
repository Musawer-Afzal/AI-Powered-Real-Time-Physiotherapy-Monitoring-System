// Mid body (core & spine) exercises configuration
export const MID_BODY_EXERCISES = {
  'pelvic-tilt': {
    id: 'pelvic-tilt',
    name: 'Pelvic Tilt',
    description: 'Lie on your back with knees bent (feet flat on floor, knees at about 90°). Flatten your lower back against the floor by tightening your abdominal muscles and tilting your pelvis backward.',
    difficulty: 'beginner',
    bodyRegion: 'mid',
    joint: 'hip',
    movementType: 'tilt',
    injuryType: 'lower-back-pain',
    targetAngles: {
      hip: {
        min: 165,
        max: 180,
        optimal: [175, 180]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'hip',
      minAngle: 165,
      maxAngle: 178,
      direction: 'tilt-return'
    }
  },
  
  'bridge': {
    id: 'bridge',
    name: 'Supine Bridge',
    description: 'Lie on your back with knees bent (feet flat on floor, knees at about 90°). Lift your hips upward while keeping shoulders on the floor.',
    difficulty: 'beginner',
    bodyRegion: 'mid',
    joint: 'hip',
    movementType: 'extension',
    injuryType: 'lower-back-pain',
    targetAngles: {
      hip: {
        min: 170,
        max: 130,
        optimal: [130, 150]
      }
    },
    repCounting: {
      type: 'angle-threshold',
      joint: 'hip',
      minAngle: 165,
      maxAngle: 140,
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