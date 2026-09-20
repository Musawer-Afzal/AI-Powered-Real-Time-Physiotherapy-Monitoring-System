export const JOINT_CONFIG = {
  shoulder: {
    name: 'Shoulder',
    type: 'ball-socket',
    planes: ['sagittal', 'frontal', 'transverse'],
    normalRange: {
      flexion: [0, 180],
      extension: [0, 60],
      abduction: [0, 180],
      adduction: [0, 45],
      rotation: [0, 90]
    },
    landmarks: {
      primary: [11, 12],
      reference: [23, 24]
    }
  },
  
  elbow: {
    name: 'Elbow',
    type: 'hinge',
    planes: ['sagittal'],
    normalRange: {
      flexion: [0, 150],
      extension: [150, 0]
    },
    landmarks: {
      primary: [13, 14],
      reference: [11, 12, 15, 16]
    }
  },
  
  neck: {
    name: 'Neck',
    type: 'pivot',
    planes: ['sagittal', 'transverse'],
    normalRange: {
      flexion: [0, 50],
      extension: [0, 60],
      rotation: [0, 80]
    },
    landmarks: {
      primary: [0, 1, 2, 3, 4],
      reference: [11, 12]
    },
    note: 'Limited accuracy with MediaPipe - use with caution'
  },
  
  hip: {
    name: 'Hip',
    type: 'ball-socket',
    planes: ['sagittal', 'frontal', 'transverse'],
    normalRange: {
      flexion: [0, 120],
      extension: [0, 30],
      abduction: [0, 45],
      adduction: [0, 30]
    },
    landmarks: {
      primary: [23, 24],
      reference: [11, 12, 25, 26]
    }
  },
  
  knee: {
    name: 'Knee',
    type: 'hinge',
    planes: ['sagittal'],
    normalRange: {
      flexion: [0, 135],
      extension: [135, 0]
    },
    landmarks: {
      primary: [25, 26],
      reference: [23, 24, 27, 28]
    }
  },
  
  ankle: {
    name: 'Ankle',
    type: 'hinge',
    planes: ['sagittal'],
    normalRange: {
      dorsiflexion: [0, 20],
      plantarflexion: [0, 50]
    },
    landmarks: {
      primary: [27, 28],
      reference: [25, 26, 31, 32]
    }
  }
};

// MediaPipe landmark indices mapped to joints
export const LANDMARK_TO_JOINT = {
  11: 'left_shoulder',
  12: 'right_shoulder',
  13: 'left_elbow',
  14: 'right_elbow',
  15: 'left_wrist',
  16: 'right_wrist',
  23: 'left_hip',
  24: 'right_hip',
  25: 'left_knee',
  26: 'right_knee',
  27: 'left_ankle',
  28: 'right_ankle'
};

export const ANGLE_FORMULAS = {
  // Angle between three points: a (proximal) - b (joint) - c (distal)
  shoulder_abduction: [23, 11, 13],  // Hip - Shoulder - Elbow
  shoulder_flexion: [23, 11, 13],    // Hip - Shoulder - Elbow
  elbow_flexion: [11, 13, 15],       // Shoulder - Elbow - Wrist
  neck_flexion: [0, 11, 23],         // Ear - Shoulder - Hip (approx)
  hip_flexion: [11, 23, 25],         // Shoulder - Hip - Knee
  knee_flexion: [23, 25, 27],        // Hip - Knee - Ankle
  ankle_dorsiflexion: [25, 27, 31]   // Knee - Ankle - Foot
};