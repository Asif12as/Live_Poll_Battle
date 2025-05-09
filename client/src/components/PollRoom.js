// client/src/components/PollRoom.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Timer from './Timer';
import VotingOptions from './VotingOptions';
import Results from './Results';
import socket from '../socket';
import UserPresence from './UserPresence';
import PollAnalytics from './PollAnalytics';
import PollConfetti from './PollConfetti';

function PollRoom({ user, room, setRoom }) {
  const { roomId } = useParams();
  const [hasVoted, setHasVoted] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false); // Moved inside the component
  
  useEffect(() => {
    // Check if user has already voted (from localStorage)
    const previousVote = localStorage.getItem('vote_for_room_' + roomId);
    if (previousVote) {
      setHasVoted(true);
    }
    
    // Join the room if needed (page refresh case)
    if (!room || room.id !== roomId) {
      socket.emit('join_room', {
        username: user.username,
        roomId
      });
    }
  }, [roomId, user, room]);
  
  if (!room) {
    return <div>Loading room...</div>;
  }
  
  return (
    <div className="poll-room">
      <h1>Poll Room: {roomId}</h1>
      
      <div className="room-info">
        <p>Created by: {room.creator}</p>
        <Timer timeLeft={room.timeLeft || 60000} />
      </div>
      
      <VotingOptions 
        room={room} 
        user={user} 
        hasVoted={hasVoted}
        setHasVoted={setHasVoted}
      />
      
      <Results room={room} />
      
      <UserPresence room={room} currentUser={user} />
      
      {/* Added analytics toggle button */}
      {room.creator === user.username && (
        <div className="analytics-toggle">
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="secondary-btn"
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          
          {showAnalytics && <PollAnalytics room={room} />}
        </div>
      )}
      
      <div className="share-code">
        <p>Share this code with others to join: <strong>{roomId}</strong></p>
      </div>
      
      {/* Added confetti component */}
      <PollConfetti active={room.active} options={room.options} />
    </div>
  );
}

export default PollRoom;