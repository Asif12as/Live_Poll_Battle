// client/src/components/Timer.js
import React from 'react';

function Timer({ timeLeft }) {
  // Convert milliseconds to seconds
  const seconds = Math.floor(timeLeft / 1000);
  
  return (
    <div className="timer">
      <h3>Time Remaining: {seconds}s</h3>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(seconds / 60) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default Timer;