import { Pose } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let pose = null;
let videoElement = null;
let canvasElement = null;
let canvasContext = null;
let lastVideoTime = -1;
let isRunning = false;

export function setupPose(onResults) {
  pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  pose.setOptions({
    modelComplexity: 0,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  pose.onResults((results) => {
    onResults(results);
    drawPose(results);
  });

  return pose;
}

export function startPoseDetection(videoRef, canvasRef, onResults) {
  if (!videoRef.current || !canvasRef.current) {
    console.error('Video or canvas ref not available');
    return;
  }

  videoElement = videoRef.current;
  canvasElement = canvasRef.current;
  canvasContext = canvasElement.getContext('2d');

  // Set canvas to match video dimensions
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  if (!pose) {
    pose = setupPose(onResults);
  }

  isRunning = true;
  detectPose();
}

function detectPose() {
  if (!isRunning || !videoElement || !pose) return;

  if (videoElement.currentTime !== lastVideoTime) {
    lastVideoTime = videoElement.currentTime;
    pose.send({ image: videoElement });
  }

  requestAnimationFrame(detectPose);
}

export function stopPoseDetection() {
  isRunning = false;
  
  // Clear the canvas
  if (canvasContext && canvasElement) {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
}

function drawPose(results) {
  if (!canvasContext || !canvasElement || !results.poseLandmarks) return;

  // Clear canvas
  canvasContext.save();
  canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
  canvasContext.scale(-1, 1);
  canvasContext.translate(-canvasElement.width, 0);
  
  // Draw video first
  canvasContext.drawImage(
    videoElement,
    0, 0, canvasElement.width, canvasElement.height
  );
  
  if (results.poseLandmarks) {
    drawConnectors(canvasContext, results.poseLandmarks, Pose.POSE_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 4
    });
    drawLandmarks(canvasContext, results.poseLandmarks, {
      color: '#FF0000',
      lineWidth: 2,
      radius: 5
    });
  }
  
  canvasContext.restore();
}