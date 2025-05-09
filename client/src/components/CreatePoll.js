// client/src/components/CreatePoll.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function CreatePoll({ user }) {
  const [question, setQuestion] = useState('Cats vs Dogs');
  const [option1, setOption1] = useState('Cats');
  const [option2, setOption2] = useState('Dogs');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    socket.emit('create_room', {
      username: user.username,
      question,
      options: [option1, option2]
    });
    
    socket.once('room_created', ({ roomId }) => {
      navigate(`/room/${roomId}`);
    });
  };
  
  return (
    <div className="create-poll-container">
      <h1>Create a New Poll</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Poll Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Option 1:</label>
          <input
            type="text"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Option 2:</label>
          <input
            type="text"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}

export default CreatePoll;