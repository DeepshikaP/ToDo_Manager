// server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';
import { Server } from 'socket.io';
import http from 'http';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import './config/passportConfig.js'; // Google OAuth config

dotenv.config();

const app = express();
const server = http.createServer(app);

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // change to 3000 if using CRA
    credentials: true
  }
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop the app on DB connection failure
  });

// --- Middleware ---
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// --- Passport Initialization ---
app.use(passport.initialize()); // No session — JWT-based

// --- API Routes ---
app.use('/api/auth', authRoutes);   // Google OAuth routes
app.use('/api/tasks', taskRoutes);  // Task CRUD routes

// --- Socket.IO Event ---
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  socket.on('task-updated', (data) => {
    socket.broadcast.emit('task-update', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

