import { useState, useEffect, useRef } from 'react';
import './ExerciseSelector.css';

export default function ExerciseSelector({ selectedExercise, onSelect, disabled, category }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);
  
  // Get exercises based on category with CORRECT IDs matching your config files
  const getExercises = () => {
    if (category === 'upper') {
      return {
        'Shoulder Exercises': {
          'shoulder-pendulum': { name: 'Shoulder Pendulum', description: 'Gentle passive shoulder mobilization' },
          'shoulder-flexion': { name: 'Shoulder Flexion', description: 'Raise arm forward and upward' },
          'shoulder-abduction': { name: 'Shoulder Abduction', description: 'Raise arm sideways' }
        },
        'Elbow Exercises': {
          'elbow-flexion': { name: 'Elbow Flexion', description: 'Bend and straighten elbow' }
        }
      };
    } else if (category === 'mid') {
      return {
        'Core & Spine Exercises': {
          'pelvic-tilt': { name: 'Pelvic Tilt', description: 'Flatten lower back against floor' },
          'bridge': { name: 'Supine Bridge', description: 'Lift hips upward' }
        }
      };
    } else if (category === 'lower') {
      return {
        'Hip Exercises': {
          'straight-leg-raise': { name: 'Straight Leg Raise', description: 'Lift straight leg to hip height' },
          'hip-abduction': { name: 'Hip Abduction', description: 'Lift top leg upward' }
        },
        'Knee Exercises': {
          'knee-flexion': { name: 'Knee Flexion', description: 'Bend and straighten knee' }
        }
      };
    }
    return {};
  };

  const exercises = getExercises();
  const hasExercises = Object.keys(exercises).length > 0;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (exerciseId) => {
    console.log('Exercise selected:', exerciseId);
    if (!disabled) {
      onSelect(exerciseId);
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Get display name for selected exercise
  const getSelectedExerciseName = () => {
    if (!selectedExercise) return '-- Select Exercise --';
    
    for (const categoryName in exercises) {
      if (exercises[categoryName][selectedExercise]) {
        return exercises[categoryName][selectedExercise].name;
      }
    }
    return selectedExercise.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="exercise-selector" ref={selectorRef}>
      <div 
        className={`selector-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        <span className="selected-exercise">
          {getSelectedExerciseName()}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && !disabled && (
        <div className="dropdown-menu">
          {hasExercises ? (
            Object.entries(exercises).map(([categoryName, categoryExercises]) => (
              <div key={categoryName} className="dropdown-category">
                <div className="category-header">{categoryName}</div>
                {Object.entries(categoryExercises).map(([exerciseId, exercise]) => (
                  <div
                    key={exerciseId}
                    className={`dropdown-item ${selectedExercise === exerciseId ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(exerciseId);
                    }}
                  >
                    <div className="exercise-name">{exercise.name}</div>
                    <div className="exercise-description">{exercise.description}</div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="dropdown-empty">No exercises available</div>
          )}
        </div>
      )}
    </div>
  );
}