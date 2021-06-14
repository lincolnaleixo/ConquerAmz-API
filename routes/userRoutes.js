import Router from 'express';
import userServices from './../services/users.mjs';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello from Selling-Partner-API!');
});

router.get('/users', (req, res) => {
  userServices.getAllUsers();
});

router.post('/user', (req, res) => {
  userServices.createUser();
});

export default router;
