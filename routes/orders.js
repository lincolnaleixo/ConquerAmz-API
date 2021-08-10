import { Router } from 'express';
import ordersController from '../controllers/ordersController.js';
import AuthMiddleware from '../services/middleware/auth.js';

const router = Router();

router.get('/get-orders-simple', ordersController.manualSyncOrders);
router.post('/get-orders-aws', ordersController.getOrdersAws);
router.get('/get-orders', AuthMiddleware.authenticateCalls, ordersController.getOrders);
router.get('/get-latest-orders', AuthMiddleware.authenticateCalls, ordersController.getLatestOrders);
router.post('/save-orders', AuthMiddleware.authenticateCalls, ordersController.saveOrders);

export default router;
