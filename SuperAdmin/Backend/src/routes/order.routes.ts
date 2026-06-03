import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UserRole } from '@prisma/client';
import { getOrderByIdSchema, listOrdersQuerySchema } from '../validators/order.validator';

const router = Router();

// Secure all order endpoints under SUPER_ADMIN role
router.use(authenticate, authorize([UserRole.SUPER_ADMIN]));

router.get('/', validate(listOrdersQuerySchema), OrderController.list);
router.get('/:id', validate(getOrderByIdSchema), OrderController.detail);

export default router;
