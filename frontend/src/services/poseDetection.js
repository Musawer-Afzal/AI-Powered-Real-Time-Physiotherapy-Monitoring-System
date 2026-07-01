import { Pose } from '@mediapipe/pose'; 
export function initializePoseDetection(videoRef, canvasRef, onResults) {
   const pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  pose.onResults((results) => {
    const canvas = canvasRef.current; // ✅ Define canvas here
    const video = videoRef.current; // ✅ Define video here
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ✅ MIRROR THE ENTIRE CANVAS CONTEXT
    ctx.save();
    ctx.scale(-1, 1); // Mirror horizontally
    ctx.translate(-canvas.width, 0); // Move back into view
    // Draw video (will be mirrored)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (results.poseLandmarks) {
      // ✅ SWAP LEFT/RIGHT LANDMARKS because MediaPipe is seeing them inverted
      const swappedLandmarks = [...results.poseLandmarks];
      // Swap left and right landmarks
      const swapPairs = [
        [11, 12], // Shoulders
        [13, 14], // Elbows
        [15, 16], // Wrists
        [23, 24], // Hips
        [25, 26], // Knees
        [27, 28] // Ankles
        ];
        for (const [a, b] of swapPairs) {
          if (swappedLandmarks[a] && swappedLandmarks[b]) {
            const temp = swappedLandmarks[a];
            swappedLandmarks[a] = swappedLandmarks[b];
            swappedLandmarks[b] = temp;
            }
          }
          const connections = [ 
          [11, 13], [13, 15], // Left arm (after swap) 
          [12, 14], [14, 16], // Right arm (after swap) 
          [11, 23], [23, 25], [25, 27], // Left leg 
          [12, 24], [24, 26], [26, 28], // Right leg 
          [11, 12], [23, 24], // Shoulders and hips 
          ];
          // Draw connections 
          ctx.strokeStyle = '#00FF00'; 
          ctx.lineWidth = 4; 
          ctx.lineCap = 'round';

          for (const [a, b] of connections) { 
            const p1 = swappedLandmarks[a]; 
            const p2 = swappedLandmarks[b]; 
            if (p1?.visibility > 0.5 && p2?.visibility > 0.5) { 
              ctx.beginPath(); ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height); 
              ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height); 
              ctx.stroke(); 
            } 
          }
          // Draw joints 
          ctx.fillStyle = '#FF0000'; 
          const joints = [11,12,13,14,15,16,23,24,25,26,27,28]; 
          for (const i of joints) { 
            const p = swappedLandmarks[i]; 
            if (p?.visibility > 0.5) { 
              ctx.beginPath(); 
              ctx.arc( p.x * canvas.width, p.y * canvas.height, 5, 0, Math.PI * 2 ); 
              ctx.fill(); 
            } 
          } 
        }

        ctx.restore(); // Restore to normal state

        if (results.poseLandmarks && onResults) { 
          // Pass the original, unswapped landmarks for angle calculations
          onResults(results); 
        }
      });
      return pose; 
}

export async function startDetection(videoRef, canvasRef, pose) { 
  // Correct export name 
  if (!videoRef.current || !canvasRef.current || !pose) return; 
  if (videoRef.current.readyState < 2) { 
    await new Promise((r) => (videoRef.current.onloadedmetadata = r)); 
  }

  const container = canvasRef.current.parentElement; 
  canvasRef.current.width = container.clientWidth; 
  canvasRef.current.height = container.clientHeight;

  const loop = async () => { 
    if (videoRef.current.readyState >= 2) { 
      await pose.send({ image: videoRef.current }); 
    } 
    requestAnimationFrame(loop); 
  };
  loop(); 
}

export function stopDetection(pose) { 
  if (pose) { 
    try { 
      pose.close(); // This closes MediaPipe resources 
      console.log('Pose detection stopped'); 
    } catch (err) { 
      console.error('Error stopping pose detection:', err); 
    } 
  } 
}