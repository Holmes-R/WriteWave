// File: server/routes/userRouters.js
import express from 'express';
import { register, login, getProfile, editProfile } from '../controllers/userController.js';
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post('/register', upload.single('avatar'), register);
router.post('/login', login); 
router.get('/profile/:id', getProfile);
router.put('/edit/id/:id', auth, upload.single('avatar'), editProfile);

export default router;
