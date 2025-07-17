// File: server/routes/userRouters.js
import express from 'express';
import { register, login, getProfile, editProfile } from '../controllers/userController.js';
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();


router.post('/register', register);
router.post('/login', login); 
router.get('/profile/:id', getProfile);
router.put('/:id/edit', upload.single('avatar'), editProfile); 
export default router;
