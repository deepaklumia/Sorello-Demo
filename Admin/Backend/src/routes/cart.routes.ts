import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticateRestaurant } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  addCartItemSchema,
  updateCartItemSchema,
  cartIdParamSchema,
} from '../validators/cart.validator';

const router = Router();

router.use(authenticateRestaurant);

// Cart routes
router.post('/cart', validate(addCartItemSchema), CartController.addItemToCart);
router.get('/cart/:id', validate(cartIdParamSchema), CartController.getCart);
router.patch('/cart/:id/items/:itemId', validate(updateCartItemSchema), CartController.updateCartItem);
router.delete('/cart/:id/items/:itemId', validate(cartIdParamSchema), CartController.removeItemFromCart);
router.delete('/cart/:id', validate(cartIdParamSchema), CartController.clearCart);

export default router;
