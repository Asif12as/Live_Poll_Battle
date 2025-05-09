import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import CreatePoll from './components/CreatePoll';
import JoinPoll from './components/JoinPoll';
import PollRoom from './components/PollRoom';
import socket from './socket';
import './index.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('poll_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [room, setRoom] = useState(() => {
    const savedRoom = localStorage.getItem('poll_room');
    return savedRoom ? JSON.parse(savedRoom) : null;
  });
  
  useEffect(() => {
    if (user) {
      localStorage.setItem('poll_user', JSON.stringify(user));
    }
  }, [user]);
  
  useEffect(() => {
    if (room) {
      localStorage.setItem('poll_room', JSON.stringify(room));
    }
  }, [room]);
  
  useEffect(() => {
    socket.on('room_created', ({ roomId, room }) => {
      setRoom(room);
    });
    
    socket.on('room_joined', ({ roomId, room }) => {
      setRoom(room);
    });
    
    socket.on('vote_update', ({ room: updatedRoom }) => {
      setRoom(prevRoom => ({
        ...prevRoom,
        options: updatedRoom.options
      }));
    });
    
    socket.on('poll_ended', ({ roomId, results }) => {
      setRoom(prevRoom => ({
        ...prevRoom,
        active: false,
        options: results
      }));
    });
    
    socket.on('timer_update', ({ roomId, timeLeft }) => {
      setRoom(prevRoom => ({
        ...prevRoom,
        timeLeft
      }));
    });
    
    socket.on('error', ({ message }) => {
      alert(message);
    });
    
    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('vote_update');
      socket.off('poll_ended');
      socket.off('timer_update');
      socket.off('error');
    };
  }, []);
  
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route path="/create" element={user ? <CreatePoll user={user} /> : <Navigate to="/" />} />
          <Route path="/join" element={user ? <JoinPoll user={user} /> : <Navigate to="/" />} />
          <Route path="/room/:roomId" element={
            user ? 
              <PollRoom user={user} room={room} setRoom={setRoom} /> : 
              <Navigate to="/" />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;