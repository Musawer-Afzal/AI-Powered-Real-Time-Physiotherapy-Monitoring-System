// Export all exercises
export { UPPER_BODY_EXERCISES, getUpperBodyExercise, getUpperBodyExercisesByCategory } from './upper-body';
export { MID_BODY_EXERCISES, getMidBodyExercise, getMidBodyExercisesByCategory } from './mid-body';
export { LOWER_BODY_EXERCISES, getLowerBodyExercise, getLowerBodyExercisesByCategory } from './lower-body';

// Combined getter for any exercise
export const getExercise = (id) => {
  // Try to get from upper body
  try {
    const upper = getUpperBodyExercise(id);
    if (upper) return upper;
  } catch (e) {
    console.log('Not in upper body:', id);
  }
  
  // Try to get from mid body
  try {
    const mid = getMidBodyExercise(id);
    if (mid) return mid;
  } catch (e) {
    console.log('Not in mid body:', id);
  }
  
  // Try to get from lower body
  try {
    const lower = getLowerBodyExercise(id);
    if (lower) return lower;
  } catch (e) {
    console.log('Not in lower body:', id);
  }
  
  console.error('Exercise not found:', id);
  return null;
};