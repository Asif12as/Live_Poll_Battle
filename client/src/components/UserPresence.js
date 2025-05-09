import React, { useState, useEffect } from 'react';
import socket from '../socket';

function UserPresence({ room, currentUser }) {
  const [users, setUsers] = useState([]);
  const [reaction, setReaction] = useState('');
  const [reactions, setReactions] = useState([]);
  
  useEffect(() => {
    if (room && room.users) {
      const usersList = Object.values(room.users);
      setUsers(usersList);
    }
  }, [room]);
  
  useEffect(() => {
    socket.on('user_reaction', ({ userId, emoji, username }) => {
      // Add the reaction to the list with animation data
      const newReaction = {
        id: Date.now(),
        userId,
        username,
        emoji,
        x: Math.random() * 80 + 10, // Random x position (10-90%)
        y: Math.random() * 40 + 30, // Random y position (30-70%)
        scale: Math.random() * 0.5 + 1, // Random scale (1-1.5)
        rotation: Math.random() * 30 - 15 // Random rotation (-15° to 15°)
      };
      
      setReactions(prev => [...prev, newReaction]);
      
      // Remove the reaction after animation
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== newReaction.id));
      }, 3000);
    });
    
    return () => {
      socket.off('user_reaction');
    };
  }, []);
  
  const sendReaction = (emoji) => {
    socket.emit('send_reaction', {
      roomId: room.id,
      emoji,
      username: currentUser.username
    });
    
    setReaction('');
  };
  
  const emojis = ['👍', '👎', '❤️', '😂', '😮', '🎉', '🤔', '👏'];
  
  return (
    <div className="user-presence-container">
      <div className="online-users">
        <h3>Users in Room ({users.length})</h3>
        <div className="user-list">
          {users.map(user => (
            <div 
              key={user.id} 
              className={`user-badge ${user.voted ? 'voted' : ''} ${user.id === currentUser.id ? 'current-user' : ''}`}
            >
              <span className="user-status-dot"></span>
              {user.username}
              {user.voted && <span className="voted-label">Voted</span>}
            </div>
          ))}
        </div>
      </div>
      
      <div className="reaction-container">
        <h3>React to the Poll</h3>
        <div className="reaction-buttons">
          {emojis.map(emoji => (
            <button 
              key={emoji}
              className="emoji-button"
              onClick={() => sendReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      
      <div className="live-reactions">
        {reactions.map(reaction => (
          <div
            key={reaction.id}
            className="floating-emoji"
            style={{
              left: `${reaction.x}%`,
              bottom: `${reaction.y}%`,
              transform: `scale(${reaction.scale}) rotate(${reaction.rotation}deg)`
            }}
          >
            <span className="reaction-emoji">{reaction.emoji}</span>
            <span className="reaction-username">{reaction.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPresence;