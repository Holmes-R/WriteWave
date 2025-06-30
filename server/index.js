import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import adminRouter from './routes/adminRouters.js';
import blogRouter from './routes/blogRouters.js';
import userRouter from './routes/userRouters.js';

dotenv.config();
const app = express();
await connectDB();

app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));

app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/users', userRouter); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
