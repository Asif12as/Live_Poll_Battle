const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://livepollbattle.vercel.app", 
    methods: ["GET", "POST"]
  }
});


// In-memory storage for rooms
const rooms = {};

// Room timer function
function startRoomTimer(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  
  const timeLeft = room.endTime - Date.now();
  
  if (timeLeft <= 0) {
    room.active = false;
    io.to(roomId).emit('poll_ended', { 
      roomId,
      results: room.options
    });
    return;
  }
  
  // Broadcast timer update every second
  const interval = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, room.endTime - now);
    
    io.to(roomId).emit('timer_update', { 
      roomId,
      timeLeft: remaining
    });
    
    if (remaining <= 0) {
      clearInterval(interval);
      room.active = false;
      io.to(roomId).emit('poll_ended', { 
        roomId,
        results: room.options
      });
    }
  }, 1000);
}

// WebSocket logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new poll room
  socket.on('create_room', ({ username, question, options }) => {
    const roomId = uuidv4().substring(0, 6).toUpperCase(); // Generate a short room code
    
    rooms[roomId] = {
      id: roomId,
      creator: username,
      question,
      options: {
        option1: { text: options[0], votes: 0 },
        option2: { text: options[1], votes: 0 }
      },
      users: {},
      active: true,
      startTime: Date.now(),
      endTime: Date.now() + 60000 // 60 seconds from now
    };
    
    // Add this user to the room
    rooms[roomId].users[socket.id] = { id: socket.id, username, voted: false };
    
    // Join the socket to this room
    socket.join(roomId);
    
    // Send room details back to creator
    socket.emit('room_created', { 
      roomId, 
      room: rooms[roomId]
    });
    
    // Start timer for this room
    startRoomTimer(roomId);
  });

  // Join an existing room
  socket.on('join_room', ({ username, roomId }) => {
    const room = rooms[roomId];
    
    if (!room) {
      return socket.emit('error', { message: 'Room not found' });
    }
    
    // Add user to room
    room.users[socket.id] = { id: socket.id, username, voted: false };
    
    // Join the socket to this room
    socket.join(roomId);
    
    // Send room details to the user
    socket.emit('room_joined', { roomId, room });
    
    // Notify others that a new user joined
    socket.to(roomId).emit('user_joined', { 
      user: { id: socket.id, username }
    });
  });

  // Handle vote
  socket.on('submit_vote', ({ roomId, option }) => {
    const room = rooms[roomId];
    
    if (!room || !room.active) {
      return socket.emit('error', { message: 'Voting is not active in this room' });
    }
    
    const user = room.users[socket.id];
    
    if (!user) {
      return socket.emit('error', { message: 'User not found in room' });
    }
    
    if (user.voted) {
      return socket.emit('error', { message: 'You have already voted' });
    }
    
    // Record the vote
    room.options[option].votes++;
    user.voted = true;
    user.votedFor = option;
    
    // Broadcast updated results to all users in the room
    io.to(roomId).emit('vote_update', { 
      room: {
        options: room.options,
        question: room.question,
        endTime: room.endTime
      }
    });
  });

  // Handle emoji reactions
  socket.on('send_reaction', ({ roomId, emoji, username }) => {
    socket.to(roomId).emit('user_reaction', {
      userId: socket.id,
      emoji,
      username
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Find which rooms this user is in
    for (const roomId in rooms) {
      if (rooms[roomId] && rooms[roomId].users && rooms[roomId].users[socket.id]) {
        // Remove user from room
        delete rooms[roomId].users[socket.id];
        
        // Notify others that user left
        socket.to(roomId).emit('user_left', { userId: socket.id });
        
        // If room is empty, clean it up
        if (Object.keys(rooms[roomId].users).length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
