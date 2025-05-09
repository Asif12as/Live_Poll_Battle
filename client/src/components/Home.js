// client/src/components/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ user, setUser }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setUser({ username });
      navigate('/create');
    }
  };
  
  if (user) {
    return (
      <div className="home-container">
        <h1>Welcome, {user.username}!</h1>
        <div className="button-group">
          <button onClick={() => navigate('/create')}>Create New Poll</button>
          <button onClick={() => navigate('/join')}>Join Existing Poll</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="home-container">
      <h1>Live Poll Battle</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default Home;