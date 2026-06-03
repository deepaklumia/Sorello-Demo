import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateRestaurant } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { listOrdersQuerySchema, getOrderByIdSchema, createOrderSchema, updateOrderSchema } from '../validators/order.validator';

const router = Router();

router.use(authenticateRestaurant);

router.get('/orders', validate(listOrdersQuerySchema), OrderController.getOrders);
router.get('/orders/:id', validate(getOrderByIdSchema), OrderController.getOrderById);
router.post('/orders', validate(createOrderSchema), OrderController.createOrder);
router.patch('/orders/:id', validate(updateOrderSchema), OrderController.updateOrder);

export default router;

