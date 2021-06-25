import { Router } from 'express';
import userController from '../controllers/userController.js';
import spConfigController from '../controllers/spConfig.js';
import AuthMiddleware from '../services/middleware/auth.js';

const router = Router();

router.post('/register', userController.registerNewUser);
router.post('/login', userController.loginUser);
router.get('/me', AuthMiddleware.authenticateCalls, userController.getUserDetails);

router.post('/save-sp-auth', AuthMiddleware.authenticateCalls, spConfigController.saveUserConfig);
router.get('/get-sp-auth', AuthMiddleware.authenticateCalls, spConfigController.getUserConfig);

router.post('/create-instance', spConfigController.createUserInstance)

export default router;
