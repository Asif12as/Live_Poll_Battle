// client/src/components/VotingOptions.js
import React from 'react';
import socket from '../socket';

function VotingOptions({ room, user, hasVoted, setHasVoted }) {
  const handleVote = (option) => {
    socket.emit('submit_vote', {
      roomId: room.id,
      option
    });
    
    // Save vote in local storage
    localStorage.setItem('vote_for_room_' + room.id, option);
    setHasVoted(true);
  };
  
  return (
    <div className="voting-options">
      <h2>{room.question}</h2>
      
      <div className="options">
        <button 
          className={`option-btn ${hasVoted ? 'disabled' : ''}`}
          onClick={() => !hasVoted && handleVote('option1')}
          disabled={hasVoted || !room.active}
        >
          {room.options.option1.text}
        </button>
        
        <button 
          className={`option-btn ${hasVoted ? 'disabled' : ''}`}
          onClick={() => !hasVoted && handleVote('option2')}
          disabled={hasVoted || !room.active}
        >
          {room.options.option2.text}
        </button>
      </div>
      
      {hasVoted && <p>You have already voted!</p>}
      {!room.active && <p>Voting has ended!</p>}
    </div>
  );
}

export default VotingOptions;