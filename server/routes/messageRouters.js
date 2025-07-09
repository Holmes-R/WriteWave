import express from 'express';
import { 
    getUserForSidebar, 
    sendMessage,
    getMessages,
    markMessageAsSeen 
} from '../controllers/messageController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get users for chat sidebar
router.get('/users', auth, getUserForSidebar);

// Get conversation with a specific user
router.get('/conversation/:id', auth, getMessages);

// Mark a message as seen
router.put('/seen/:id', auth, markMessageAsSeen);

// Send a message to a user
router.post('/send/:id', auth, sendMessage);

export default router;