import express from 'express';
import { getChat, sendMessage } from '../controllers/chatController.js';    
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/:userId', auth,async( req,res)=>{
    const { userId } = req.user.userId;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
        $or: [
            { sender: userId, receiver: otherUserId },
            { sender: otherUserId, receiver: userId }
        ]
    }).sort({ timestamp: 1 });
 
});
export default router;