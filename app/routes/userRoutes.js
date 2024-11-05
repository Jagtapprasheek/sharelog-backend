import express from 'express';
import  userController from '../controllers/userController.js';
import { verifyUser } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', verifyUser, userController.getUser);

router.get('/dashboard', verifyUser, userController.getDashboardData);

export default router;