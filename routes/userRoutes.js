import express from 'express';
import { registerUser, loginUser, getAllUsers, getNormalUsers } from '../controllers/userController.js';

const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

router.get('/', getAllUsers);

router.get('/normal', getNormalUsers);

export default router;
