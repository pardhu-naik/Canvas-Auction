const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const { Server } = require('socket.io');

// Config
dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io to app
app.set('io', io);

// User Socket Mapping
const userSocketMap = {};

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Map user to socket
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    userSocketMap[userData._id] = socket.id;
    console.log(`User ${userData._id} setup with socket ${socket.id}`);
  });

  // Join a specific artwork auction room
  socket.on('join_auction', (artworkId) => {
    socket.join(artworkId);
    console.log(`User joined auction: ${artworkId}`);
  });

  // Handle placing a new bid
  socket.on('place_bid', (data) => {
    // data should contain { artworkId, bidAmount, userId, userName }
    io.to(data.artworkId).emit('update_bid', data);
    console.log(`Bid placed on ${data.artworkId}: ${data.bidAmount}`);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    // Remove user from map
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
  });
});

// Run Server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
