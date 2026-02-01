import './HelpModal.css';

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to Use Physiotherapy Assistant</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <section className="help-section">
            <h3>📋 Getting Started</h3>
            <ol>
              <li>Make sure you have a webcam connected and working</li>
              <li>Ensure you have good lighting in the room</li>
              <li>Stand about 2-3 meters away from the camera</li>
              <li>Wear clothing that contrasts with your background</li>
            </ol>
          </section>
          
          <section className="help-section">
            <h3>🎯 Using the System</h3>
            <ol>
              <li><strong>Select an Exercise:</strong> Choose from the exercise list on the left</li>
              <li><strong>Start Session:</strong> Click "Start Session" when ready</li>
              <li><strong>Position Yourself:</strong> Make sure your whole body is visible</li>
              <li><strong>Follow Instructions:</strong> Perform the exercise as shown</li>
              <li><strong>View Feedback:</strong> Real-time feedback appears in the right panel</li>
              <li><strong>End Session:</strong> Click "Pause Session" or "Reset" when done</li>
            </ol>
          </section>
          
          <section className="help-section">
            <h3>⚙️ Understanding Feedback</h3>
            <ul>
              <li><strong>Rep Count:</strong> Number of correctly performed repetitions</li>
              <li><strong>Form Score:</strong> Accuracy of your exercise form (0-100%)</li>
              <li><strong>Angle Display:</strong> Shows joint angles for form correction</li>
              <li><strong>Form Tips:</strong> Suggestions to improve your technique</li>
            </ul>
          </section>
          
          <section className="help-section">
            <h3>🔧 Troubleshooting</h3>
            <ul>
              <li><strong>No pose detected:</strong> Move closer to camera or improve lighting</li>
              <li><strong>Incorrect angles:</strong> Ensure you're facing the camera directly</li>
              <li><strong>Laggy video:</strong> Close other applications using the camera</li>
              <li><strong>Reps not counting:</strong> Make sure you complete full range of motion</li>
            </ul>
          </section>
        </div>
        
        <div className="modal-footer">
          <button className="got-it-button" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}