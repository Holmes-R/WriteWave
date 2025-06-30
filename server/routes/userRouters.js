// File: server/routes/userRouters.js
import express from 'express';
import { register, login, getProfile } from '../controllers/userController.js';
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post('/register', upload.single('avatar'), register);
router.post('/login', login); 
router.get('/profile/:username', getProfile);

export default router;
