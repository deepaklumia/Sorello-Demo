import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticateRestaurant } from '../middlewares/auth.middleware';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/change-password', authenticateRestaurant, validate(changePasswordSchema), AuthController.changePassword);

export default router;
