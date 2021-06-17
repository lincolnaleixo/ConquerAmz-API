import { Router } from 'express';
import userController from '../controllers/userController.js';

const router = Router();

router.post('/register', userController.registerNewUser);
router.post('/login', userController.loginUser);
router.get('/me', userController.getUserDetails);

export default router;
