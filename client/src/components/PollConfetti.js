import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

function PollConfetti({ active, options }) {
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  
  useEffect(() => {
    // Only show confetti animation when the poll ends
    if (!active && !hasShownConfetti && options) {
      setHasShownConfetti(true);
      
      // Determine the winning option
      const option1Votes = options.option1.votes;
      const option2Votes = options.option2.votes;
      
      let winner = null;
      let winnerColor = null;
      
      if (option1Votes > option2Votes) {
        winner = options.option1.text;
        winnerColor = "#36A2EB"; // Blue for option 1
      } else if (option2Votes > option1Votes) {
        winner = options.option2.text;
        winnerColor = "#FF6384"; // Pink for option 2
      } else {
        winner = "It's a tie!";
        winnerColor = "#4CAF50"; // Green for tie
      }
      
      // Get the poll room container instead of using document.body
      const pollRoomContainer = document.querySelector('.poll-room');
      
      if (!pollRoomContainer) return;
      
      // Create a canvas element for the confetti
      const canvas = document.createElement('canvas');
      canvas.className = 'confetti-canvas';
      pollRoomContainer.appendChild(canvas);
      
      // Configure the confetti animation
      const myConfetti = confetti.create(canvas, { 
        resize: true,
        useWorker: true
      });
      
      // Show announcement with winner name
      const announcement = document.createElement('div');
      announcement.className = 'winner-announcement';
      announcement.innerHTML = `
        <h2>Poll Ended!</h2>
        <h3>${winner} wins!</h3>
        <p>${option1Votes > option2Votes ? options.option1.votes : options.option2.votes} votes</p>
      `;
      pollRoomContainer.appendChild(announcement);
      
      // Convert hex color to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };
      
      const rgb = hexToRgb(winnerColor);
      
      // Launch confetti
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [winnerColor]
      });
      
      // Launch a cannon of confetti from the left edge
      setTimeout(() => {
        myConfetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: [winnerColor]
        });
      }, 250);
      
      // Launch a cannon of confetti from the right edge
      setTimeout(() => {
        myConfetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: [winnerColor]
        });
      }, 400);
      
      // Clean up after animation finishes
      setTimeout(() => {
        // Remove the announcement after a delay
        if (pollRoomContainer.contains(announcement)) {
          pollRoomContainer.removeChild(announcement);
        }
        if (pollRoomContainer.contains(canvas)) {
          pollRoomContainer.removeChild(canvas);
        }
      }, 8000);
    }
  }, [active, hasShownConfetti, options]);
  
  return null; // This component doesn't render anything directly
}

export default PollConfetti;