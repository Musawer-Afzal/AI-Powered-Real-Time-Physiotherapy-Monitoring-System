// Import all exercises first
import {
  UPPER_BODY_EXERCISES,
  getUpperBodyExercise,
  getUpperBodyExercisesByCategory
} from './upper-body';

import {
  MID_BODY_EXERCISES,
  getMidBodyExercise,
  getMidBodyExercisesByCategory
} from './mid-body';

import {
  LOWER_BODY_EXERCISES,
  getLowerBodyExercise,
  getLowerBodyExercisesByCategory
} from './lower-body';


// Export everything
export {
  UPPER_BODY_EXERCISES,
  getUpperBodyExercise,
  getUpperBodyExercisesByCategory,

  MID_BODY_EXERCISES,
  getMidBodyExercise,
  getMidBodyExercisesByCategory,

  LOWER_BODY_EXERCISES,
  getLowerBodyExercise,
  getLowerBodyExercisesByCategory
};


// Combined getter
export const getExercise = (id) => {

  console.log("🔎 Searching exercise in index:", id);


  const upper = getUpperBodyExercise(id);
  if (upper) {
    console.log("✅ Found in upper body");
    return upper;
  }


  const mid = getMidBodyExercise(id);
  if (mid) {
    console.log("✅ Found in mid body");
    return mid;
  }


  const lower = getLowerBodyExercise(id);
  if (lower) {
    console.log("✅ Found in lower body");
    return lower;
  }


  console.error("❌ Exercise not found:", id);

  console.log(
    "Available mid exercises:",
    Object.keys(MID_BODY_EXERCISES)
  );

  return null;
};