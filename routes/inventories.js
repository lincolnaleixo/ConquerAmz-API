import { Router } from 'express';
import inventoriesController from '../controllers/inventoriesController.js';
import AuthMiddleware from '../services/middleware/auth.js';

const router = Router();

router.post('/get-summaries-simple', inventoriesController.demoInventorySummaries);
router.post('/get-inventories-aws', inventoriesController.getInventorySummaries);
router.get('/get-inventories', AuthMiddleware.authenticateCalls, inventoriesController.getInventoriesFromDb);

export default router;
