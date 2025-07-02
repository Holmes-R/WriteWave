import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import adminRouter from './routes/adminRouters.js';
import blogRouter from './routes/blogRouters.js';
import userRouter from './routes/userRouters.js';

import messageRouters from './routes/messageRouters.js';
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
//app.use('/api/chat', chatRouter);
app.use('api/message', messageRouters);

const httpServer = http.createServer(app);
export const io = new Server(httpServer,{
  cors:{  origin:'*'}
})

export const userSocketMap = {}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  console.log('User connected:', userId);

  if(userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", userSocketMap);
  
  socket.on('disconnect', () => {
    console.log("User Disconnected",userId);
    delete userSocketMap[userId]
    io.emit("getOnlineUsers".Object.keys(userSocketMap))
  })
});