
import express from 'express';
import { getUserForSidebar, sendMessage,getMessages,markMessageAsSeen } from '../controllers/messageController.js';
import Message from '../models/Message.js';
import auth from '../middleware/auth.js';
const messageRouters = express.Router()

messageRouters.get('/user',auth,getUserForSidebar)
messageRouters.get('/:id',auth,getMessages)
messageRouters.put('seen/:id',auth,markMessageAsSeen)
messageRouters.post('/send/:id',auth,sendMessage)
export default messageRouters