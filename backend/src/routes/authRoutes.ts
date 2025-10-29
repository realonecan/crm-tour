import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

/**
 * POST /api/v1/auth/login - Login with email and password
 */
router.post('/login', authController.login);

/**
 * POST /api/v1/auth/demo - Demo login
 */
router.post('/demo', authController.demoLogin);

export default router;
