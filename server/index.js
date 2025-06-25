import express from 'express'
import mongoose from "mongoose";
import cors from 'cors'
import connectDB from './config/db.js';
import dotenv from "dotenv";    
import { adminLogin } from './controllers/adminController.js';
import adminRouter from './routes/adminRouters.js';
import blogRouter from './routes/blogRouters.js';

dotenv.config();

const app = express()
await connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/admin', adminRouter)
app.use('/blog',blogRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)
})