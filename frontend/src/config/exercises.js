export const EXERCISES = {
  'elbow-flexion': {
    id: 'elbow-flexion',
    name: 'Elbow Flexion',
    description: 'Bend and straighten your elbow while keeping shoulder stable',
    difficulty: 'beginner',
    bodyPart: 'upper',
    
    targetAngles: {
      elbow: {
        min: 30,
        max: 150,
        optimal: [70, 120]
      }
    },
    
    formCues: [
      'Keep shoulder stable',
      'Move only your forearm',
      'Perform slowly and with control'
    ]
  },
  
  'shoulder-abduction': {
    id: 'shoulder-abduction',
    name: 'Shoulder Abduction',
    description: 'Raise arm sideways to shoulder height',
    difficulty: 'beginner',
    bodyPart: 'upper',
    
    targetAngles: {
      shoulder: {
        min: 0,
        max: 90,
        optimal: [75, 85]
      }
    },
    
    formCues: [
      'Keep elbow slightly bent',
      'Raise arm to shoulder height only',
      'Avoid shrugging shoulders'
    ]
  },
  
  'knee-extension': {
    id: 'knee-extension',
    name: 'Knee Extension',
    description: 'Straighten your knee while seated',
    difficulty: 'beginner',
    bodyPart: 'lower',
    
    targetAngles: {
      knee: {
        min: 30,
        max: 180,
        optimal: [170, 180]
      }
    },
    
    formCues: [
      'Keep back straight',
      'Focus on quadriceps contraction',
      'Hold at full extension'
    ]
  },
  
  'squat': {
    id: 'squat',
    name: 'Bodyweight Squat',
    description: 'Standing squat with proper form',
    difficulty: 'intermediate',
    bodyPart: 'full',
    
    targetAngles: {
      knee: {
        min: 70,
        max: 180,
        optimal: [80, 100]
      },
      hip: {
        min: 70,
        max: 180,
        optimal: [85, 95]
      }
    },
    
    formCues: [
      'Keep chest up',
      'Knees behind toes',
      'Maintain neutral spine'
    ]
  }
};