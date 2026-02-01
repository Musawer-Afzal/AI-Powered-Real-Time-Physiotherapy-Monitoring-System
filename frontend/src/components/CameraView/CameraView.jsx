import { useRef, useEffect, useState, useCallback } from 'react';
import { usePose } from '../../contexts/PoseContext';
import { initializePoseDetection, startDetection, stopDetection } from '../../services/poseDetection';
import './CameraView.css';

export default function CameraView({ isActive, showLandmarks, showAngles, currentExercise }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const poseRef = useRef(null);
  const { updatePoseData, angles, setIsDetecting, analysis } = usePose(); // Added analysis
  
  // Add debugging for currentExercise
  useEffect(() => {
    console.log('📹 CameraView - Exercise changed:', currentExercise);
  }, [currentExercise]);

  const [fps, setFps] = useState(0);
  const [landmarksCount, setLandmarksCount] = useState(0);
  const [confidence, setConfidence] = useState('Low');
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());
  const isInitializedRef = useRef(false);

  // FPS counter
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastFpsTimeRef.current) / 1000;
      if (elapsed > 0) {
        setFps(Math.round(frameCountRef.current / elapsed));
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize/cleanup when isActive changes
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  // Helper function to get form score text and color
  const getFormScoreInfo = (score) => {
    const formScore = score || 50;
    let text = 'Needs Work';
    let colorClass = 'form-needs-work';
    
    if (formScore >= 90) {
      text = 'Excellent';
      colorClass = 'form-excellent';
    } else if (formScore >= 75) {
      text = 'Good';
      colorClass = 'form-good';
    } else if (formScore >= 60) {
      text = 'Fair';
      colorClass = 'form-fair';
    }
    
    return { text, colorClass, value: formScore };
  };

  const startCamera = async () => {
    if (isInitializedRef.current) {
      console.log('Camera already initialized');
      return;
    }
    
    try {
      console.log('Starting camera...');
      
      // Stop existing stream if any
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        isInitializedRef.current = true;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          const onLoaded = () => {
            console.log('Camera ready:', 
              videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
            
            // Set canvas dimensions once
            if (containerRef.current && canvasRef.current) {
              const container = containerRef.current;
              canvasRef.current.width = container.clientWidth;
              canvasRef.current.height = container.clientHeight;
            }
            
            initializePose();
            resolve();
          };
          
          if (videoRef.current.readyState >= 2) {
            onLoaded();
          } else {
            videoRef.current.addEventListener('loadedmetadata', onLoaded, { once: true });
          }
        });
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Cannot access camera. Please check permissions.");
      isInitializedRef.current = false;
    }
  };

  const initializePose = () => {
    if (!videoRef.current || !canvasRef.current || !isInitializedRef.current) return;
    
    console.log('Initializing pose detection...');
    
    // Stop existing pose detection
    if (poseRef.current) {
      stopDetection(poseRef.current);
      poseRef.current = null;
    }
    
    // Initialize pose
    poseRef.current = initializePoseDetection(
      videoRef,
      canvasRef,
      (results) => {
        frameCountRef.current++;
        
        if (results.poseLandmarks) {
          const count = results.poseLandmarks.length;
          setLandmarksCount(count);
          
          // Calculate confidence
          const visibleLandmarks = results.poseLandmarks.filter(l => l.visibility > 0.5);
          const confidenceLevel = visibleLandmarks.length / count;
          
          if (confidenceLevel > 0.7) setConfidence('High');
          else if (confidenceLevel > 0.4) setConfidence('Medium');
          else setConfidence('Low');
          
          // Pass to context
          updatePoseData(results.poseLandmarks);
          setIsDetecting(true);
        } else {
          setLandmarksCount(0);
          setConfidence('Low');
          setIsDetecting(false);
        }
      }
    );
    
    // Start detection
    if (poseRef.current) {
      startDetection(videoRef, canvasRef, poseRef.current);
    }
  };

  const stopCamera = () => {
  console.log('Stopping camera...');
  
  // 1. Stop pose detection first
  if (poseRef.current) {
    stopDetection(poseRef.current);
    poseRef.current = null;
  }
  
  // 2. Stop all video tracks
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => {
      console.log(`Stopping track: ${track.kind}`);
      track.stop(); // This stops the track and turns off camera light
    });
    
    videoRef.current.srcObject = null;
  }
  
  // 3. Clear canvas
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }
  
  // 4. Reset states
  setLandmarksCount(0);
  setConfidence('Low');
  setIsDetecting(false);
  isInitializedRef.current = false;
  
  console.log('Camera fully stopped');
};

  // Get exercise-specific angles
  const getRelevantAngles = () => {
    if (!angles || !currentExercise) return {};
    
    const relevantAngles = {};
    
    switch (currentExercise) {
      case 'elbow-flexion':
        if (angles.leftElbow !== undefined) relevantAngles.leftElbow = angles.leftElbow;
        if (angles.rightElbow !== undefined) relevantAngles.rightElbow = angles.rightElbow;
        break;
      case 'shoulder-abduction':
      case 'shoulder-flexion':
      case 'shoulder-external-rotation':
        if (angles.leftShoulder !== undefined) relevantAngles.leftShoulder = angles.leftShoulder;
        if (angles.rightShoulder !== undefined) relevantAngles.rightShoulder = angles.rightShoulder;
        break;
      case 'knee-extension':
        if (angles.leftKnee !== undefined) relevantAngles.leftKnee = angles.leftKnee;
        if (angles.rightKnee !== undefined) relevantAngles.rightKnee = angles.rightKnee;
        break;
      case 'squat':
        if (angles.leftKnee !== undefined) relevantAngles.leftKnee = angles.leftKnee;
        if (angles.rightKnee !== undefined) relevantAngles.rightKnee = angles.rightKnee;
        if (angles.hip !== undefined) relevantAngles.hip = angles.hip;
        break;
      default:
        Object.keys(angles).slice(0, 4).forEach(key => {
          relevantAngles[key] = angles[key];
        });
    }
    
    return relevantAngles;
  };

  const relevantAngles = getRelevantAngles();

  return (
    <div className="camera-view">
      <div className="video-container" ref={containerRef}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />
        <canvas
          ref={canvasRef}
          className="pose-canvas"
        />
      </div>
      
      <div className="camera-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">FPS</div>
            <div className="stat-value">{fps}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Landmarks</div>
            <div className="stat-value">{landmarksCount}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Confidence</div>
            <div className={`stat-value confidence-${confidence.toLowerCase()}`}>
              {confidence}
            </div>
          </div>
        </div>
        
        {/* NEW: Performance Stats */}
        <div className="performance-stats">
          <h4>Performance</h4>
          <div className="performance-grid">
            <div className="performance-item">
              <span className="performance-label">Total Reps</span>
              <span className="performance-value">
                {analysis?.totalReps || 0}
              </span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Form Score</span>
              <span className={`performance-value ${getFormScoreInfo(analysis?.formScore).colorClass}`}>
                {getFormScoreInfo(analysis?.formScore).value}%
              </span>
            </div>
          </div>
        </div>
        
        {showAngles && Object.keys(relevantAngles).length > 0 && (
          <div className="angles-panel">
            <h4>Joint Angles</h4>
            <div className="angles-grid">
              {Object.entries(relevantAngles).map(([joint, angle]) => (
                <div key={joint} className="angle-item">
                  <span className="joint-name">
                    {joint.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="angle-value">{angle}°</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}