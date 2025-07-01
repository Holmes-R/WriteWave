import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import adminRouter from './routes/adminRouters.js';
import blogRouter from './routes/blogRouters.js';
import userRouter from './routes/userRouters.js';
import { Server } from 'socket.io';
import http from 'http';


dotenv.config();
const app = express();
await connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/users', userRouter); 
app.use('/api/chat', chatRouter);


const httpServer = http.createServer(app);
const io = new Server(httpServer,{
  cors:{  origin:'*'}
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  // Listen for new messages
  socket.on('send_message', async ({ senderId, receiverId, content }) => {
    const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
    await newMessage.save();

    // Emit to receiver room
    io.to(receiverId).emit('receive_message', {
      senderId,
      content,
      timestamp: newMessage.timestamp
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});