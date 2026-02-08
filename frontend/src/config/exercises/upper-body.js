export const UPPER_BODY_EXERCISES = {
  // Shoulder Exercises
  'shoulder-abduction': {
    id: 'shoulder-abduction',
    name: 'Shoulder Abduction',
    description: 'Raise arm sideways to shoulder height',
    difficulty: 'beginner',
    bodyRegion: 'upper',
    joint: 'shoulder',
    movementType: 'abduction',
    injuryTarget: ['rotator-cuff', 'frozen-shoulder'],
    
    // Biomechanical configuration
    landmarks: {
      proximal: 'hip',      // Reference point 1
      joint: 'shoulder',    // Joint being measured
      distal: 'elbow'       // Reference point 2
    },
    
    targetAngles: {
      shoulder: {
        min: 0,        // Starting angle
        max: 90,       // Target abduction angle
        optimal: [75, 85],  // Ideal range
        resting: 20,   // Resting position
      }
    },
    
    // Rep counting logic
    repCounting: {
      type: 'range',
      phases: {
        start: { angle: '>20', direction: 'increasing' },
        mid: { angle: '>60', direction: 'increasing' },
        end: { angle: '<30', direction: 'decreasing' }
      },
      threshold: 70,    // Minimum angle for rep to count
      cooldown: 1000,   // ms between reps
    },
    
    // Form validation
    formValidation: {
      rules: [
        {
          condition: 'shoulder_elevation > 15',
          feedback: 'Keep your shoulder relaxed, avoid shrugging',
          severity: 'warning'
        },
        {
          condition: 'trunk_lean > 10',
          feedback: 'Keep your torso upright',
          severity: 'error'
        },
        {
          condition: 'speed > 100', // degrees per second
          feedback: 'Perform the movement slowly',
          severity: 'warning'
        }
      ]
    },
    
    // Instructional data
    instructions: {
      setup: 'Stand with feet shoulder-width apart',
      movement: 'Raise your arm sideways to shoulder level',
      cues: [
        'Keep elbow slightly bent',
        'Palm facing down',
        'Move only from the shoulder'
      ],
      commonMistakes: [
        'Shrugging shoulders',
        'Leaning to the side',
        'Bending elbow too much'
      ]
    }
  },
  
  'shoulder-flexion': {
    id: 'shoulder-flexion',
    name: 'Shoulder Flexion',
    description: 'Raise arm forward to shoulder height',
    difficulty: 'beginner',
    bodyRegion: 'upper',
    joint: 'shoulder',
    movementType: 'flexion',
    injuryTarget: ['post-op-shoulder'],
    
    landmarks: {
      proximal: 'hip',
      joint: 'shoulder',
      distal: 'elbow'
    },
    
    targetAngles: {
      shoulder: {
        min: 20,
        max: 160,
        optimal: [150, 160],
        resting: 20
      }
    },
    
    repCounting: {
      type: 'range',
      phases: {
        start: { angle: '>30', direction: 'increasing' },
        mid: { angle: '>120', direction: 'increasing' },
        end: { angle: '<40', direction: 'decreasing' }
      },
      threshold: 130,
      cooldown: 1000
    }
  },
  
  'shoulder-external-rotation': {
    id: 'shoulder-external-rotation',
    name: 'Shoulder External Rotation',
    description: 'Rotate arm outward while keeping elbow bent',
    difficulty: 'intermediate',
    bodyRegion: 'upper',
    joint: 'shoulder',
    movementType: 'rotation',
    injuryTarget: ['rotator-cuff'],
    
    landmarks: {
      proximal: 'shoulder',
      joint: 'elbow',  // Elbow acts as pivot
      distal: 'wrist'
    },
    
    targetAngles: {
      shoulder: {
        min: 40,
        max: 90,
        optimal: [80, 90],
        resting: 40
      }
    },
    
    repCounting: {
      type: 'threshold',
      threshold: 80,
      direction: 'rotation',
      cooldown: 1500
    }
  },
  
  // Elbow Exercises
  'elbow-flexion': {
    id: 'elbow-flexion',
    name: 'Elbow Flexion/Extension',
    description: 'Bend and straighten your elbow',
    difficulty: 'beginner',
    bodyRegion: 'upper',
    joint: 'elbow',
    movementType: 'flexion-extension',
    injuryTarget: ['tennis-elbow', 'fractures'],
    
    landmarks: {
      proximal: 'shoulder',
      joint: 'elbow',
      distal: 'wrist'
    },
    
    targetAngles: {
      elbow: {
        min: 60,
        max: 170,
        optimal: [160, 170],
        resting: 170
      }
    },
    
    repCounting: {
      type: 'range',
      phases: {
        start: { angle: '>150', direction: 'decreasing' },
        mid: { angle: '<90', direction: 'decreasing' },
        end: { angle: '>140', direction: 'increasing' }
      },
      threshold: 100,
      cooldown: 800
    }
  },
  
  // Neck Exercises (Limited)
  // 'neck-flexion': {
  //   id: 'neck-flexion',
  //   name: 'Neck Flexion/Extension',
  //   description: 'Gently bend neck forward and backward',
  //   difficulty: 'beginner',
  //   bodyRegion: 'upper',
  //   joint: 'neck',
  //   movementType: 'flexion-extension',
  //   injuryTarget: ['cervical-stiffness'],
  //   warning: 'Requires careful monitoring - limited tracking accuracy',
    
  //   landmarks: {
  //     proximal: 'ear',
  //     joint: 'shoulder',  // Proxy for neck
  //     distal: 'hip'
  //   },
    
  //   targetAngles: {
  //     neck: {
  //       min: 120,
  //       max: 160,
  //       optimal: [140, 150],
  //       resting: 160
  //     }
  //   },
    
  //   repCounting: {
  //     type: 'gentle',
  //     threshold: 140,
  //     cooldown: 2000  // Slower for neck
  //   }
  // }
};

// Helper function to get exercises by category
export const getUpperBodyExercisesByCategory = () => {
  return {
    shoulder: ['shoulder-abduction', 'shoulder-flexion', 'shoulder-external-rotation'],
    elbow: ['elbow-flexion'],
    // neck: ['neck-flexion']
  };
};

export const getUpperBodyExercise = (id) => {
  return UPPER_BODY_EXERCISES[id];
};

export const getAllUpperBodyExercises = () => {
  return Object.values(UPPER_BODY_EXERCISES);
};