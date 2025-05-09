// client/src/components/JoinPoll.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function JoinPoll({ user }) {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    socket.emit('join_room', {
      username: user.username,
      roomId: roomId.toUpperCase()
    });
    
    socket.once('room_joined', ({ roomId }) => {
      navigate(`/room/${roomId}`);
    });
    
    socket.once('error', ({ message }) => {
      alert(message);
    });
  };
  
  return (
    <div className="join-poll-container">
      <h1>Join a Poll</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Enter Room Code:</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g., ABC123"
            required
          />
        </div>
        
        <button type="submit">Join Poll</button>
      </form>
    </div>
  );
}

export default JoinPoll;