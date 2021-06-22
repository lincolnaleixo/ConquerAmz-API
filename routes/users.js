import { Router } from 'express';
import userController from '../controllers/userController.js';
import AuthMiddleware from '../services/middleware/auth.js';

const router = Router();

router.post('/register', userController.registerNewUser);
router.post('/login', userController.loginUser);
router.get('/me', AuthMiddleware.authenticateCalls, userController.getUserDetails);

export default router;
