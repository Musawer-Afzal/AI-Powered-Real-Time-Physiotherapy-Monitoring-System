import { useState } from 'react';
import { 
  UPPER_BODY_EXERCISES, 
  getUpperBodyExercisesByCategory 
} from '../../config/exercises/upper-body';
import './ExerciseSelector.css';

export default function ExerciseSelector({ selectedExercise, onSelect, disabled, category = 'upper' }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get exercises based on category
  const getExercisesForCategory = () => {
    if (category === 'upper') {
      return UPPER_BODY_EXERCISES;
    }
    // For now, return empty for other categories
    return {};
  };
  
  const getCategoriesForDisplay = () => {
    if (category === 'upper') {
      return getUpperBodyExercisesByCategory();
    }
    return {};
  };
  
  const exercises = getExercisesForCategory();
  const categories = getCategoriesForDisplay();
  
  const selectedExerciseData = exercises[selectedExercise];

  const handleSelect = (exerciseId) => {
    onSelect(exerciseId);
    setIsDropdownOpen(false);
  };

  const renderDifficultyBadge = (difficulty) => {
    const colors = {
      beginner: '#28a745',
      intermediate: '#ffc107',
      advanced: '#dc3545'
    };
    
    return (
      <span 
        className="difficulty-badge" 
        style={{ backgroundColor: colors[difficulty] || '#6c757d' }}
      >
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  return (
    <div className="exercise-selector">
      {disabled && (
        <div className="selection-warning">
          ⚠️ Stop the current session to select a different exercise
        </div>
      )}
      
      {/* Dropdown Button */}
      <div className="dropdown-wrapper">
        <button
          className="dropdown-button"
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled}
        >
          <span className="dropdown-label">
            {selectedExerciseData ? selectedExerciseData.name : 'Choose an exercise...'}
          </span>
          <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
        </button>
        
        {/* Dropdown Menu */}
        {isDropdownOpen && !disabled && (
          <div className="dropdown-menu">
            {Object.entries(categories).map(([subcategory, exerciseIds]) => (
              exerciseIds.length > 0 && (
                <div key={subcategory} className="dropdown-category">
                  <div className="category-header">
                    {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Exercises
                  </div>
                  <div className="category-exercises">
                    {exerciseIds.map((exerciseId) => {
                      const exercise = exercises[exerciseId];
                      if (!exercise) return null;
                      
                      return (
                        <button
                          key={exercise.id}
                          className={`exercise-option ${selectedExercise === exercise.id ? 'selected' : ''}`}
                          onClick={() => handleSelect(exercise.id)}
                        >
                          <div className="exercise-option-content">
                            <div className="exercise-option-header">
                              <div className="exercise-name">{exercise.name}</div>
                              {renderDifficultyBadge(exercise.difficulty)}
                            </div>
                            <div className="exercise-details">
                              <span className="exercise-description">
                                {exercise.description}
                              </span>
                            </div>
                            {exercise.injuryTarget && exercise.injuryTarget.length > 0 && (
                              <div className="exercise-tags">
                                {exercise.injuryTarget.map((injury, idx) => (
                                  <span key={idx} className="injury-tag">
                                    {injury}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
      
      {/* Selected Exercise Details */}
      {selectedExerciseData && (
        <div className="exercise-details-panel">
          <div className="exercise-header">
            <div className="exercise-title">
              <h4>{selectedExerciseData.name}</h4>
              <div className="exercise-meta">
                {renderDifficultyBadge(selectedExerciseData.difficulty)}
                <span className="exercise-joint">
                  {selectedExerciseData.joint.charAt(0).toUpperCase() + selectedExerciseData.joint.slice(1)} Joint
                </span>
              </div>
            </div>
          </div>
          
          <div className="exercise-info">
            <p className="exercise-description-full">
              {selectedExerciseData.description}
            </p>
            
            <div className="exercise-specs">
              <div className="spec-item">
                <span className="spec-label">Movement Type:</span>
                <span className="spec-value">
                  {selectedExerciseData.movementType.split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
              </div>
              
              <div className="spec-item">
                <span className="spec-label">Target Injuries:</span>
                <span className="spec-value">
                  {selectedExerciseData.injuryTarget?.join(', ') || 'General rehabilitation'}
                </span>
              </div>
              
              {selectedExerciseData.targetAngles && (
                <div className="spec-item">
                  <span className="spec-label">Target Angles:</span>
                  <span className="spec-value">
                    {Object.entries(selectedExerciseData.targetAngles).map(([joint, target]) => (
                      <div key={joint} className="angle-range">
                        {joint}: {target.min}° - {target.max}° 
                        {target.optimal && ` (Optimal: ${target.optimal[0]}°-${target.optimal[1]}°)`}
                      </div>
                    ))}
                  </span>
                </div>
              )}
            </div>
            
            {selectedExerciseData.instructions && (
              <div className="exercise-instructions">
                <h5>Instructions:</h5>
                
                {selectedExerciseData.instructions.setup && (
                  <div className="instruction-step">
                    <strong>Setup:</strong> {selectedExerciseData.instructions.setup}
                  </div>
                )}
                
                {selectedExerciseData.instructions.movement && (
                  <div className="instruction-step">
                    <strong>Movement:</strong> {selectedExerciseData.instructions.movement}
                  </div>
                )}
                
                {selectedExerciseData.instructions.cues && selectedExerciseData.instructions.cues.length > 0 && (
                  <div className="instruction-step">
                    <strong>Form Cues:</strong>
                    <ul>
                      {selectedExerciseData.instructions.cues.map((cue, index) => (
                        <li key={index}>• {cue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedExerciseData.instructions.commonMistakes && 
                 selectedExerciseData.instructions.commonMistakes.length > 0 && (
                  <div className="instruction-step">
                    <strong>Avoid:</strong>
                    <ul>
                      {selectedExerciseData.instructions.commonMistakes.map((mistake, index) => (
                        <li key={index}>⚠️ {mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}