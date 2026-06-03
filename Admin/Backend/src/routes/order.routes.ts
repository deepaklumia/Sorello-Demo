import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateRestaurant } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { listOrdersQuerySchema, getOrderByIdSchema } from '../validators/order.validator';

const router = Router();

router.use(authenticateRestaurant);

router.get('/orders', validate(listOrdersQuerySchema), OrderController.getOrders);
router.get('/orders/:id', validate(getOrderByIdSchema), OrderController.getOrderById);

export default router;
