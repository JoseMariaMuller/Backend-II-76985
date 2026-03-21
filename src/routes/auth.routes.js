import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import { validateResetPassword } from '../middleware/validation.middleware.js';

const router = Router();
const authController = new AuthController();


router.post('/password-recovery', async (req, res) => {
    await authController.requestPasswordReset(req, res);
});

router.post('/reset-password', validateResetPassword, async (req, res) => {
    await authController.resetPassword(req, res);
});

export default router;