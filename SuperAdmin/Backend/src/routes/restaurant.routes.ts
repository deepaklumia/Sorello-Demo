import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UserRole } from '@prisma/client';
import {
  createRestaurantSchema,
  getRestaurantByIdSchema,
  listRestaurantsQuerySchema,
  updateRestaurantSchema,
  updateRestaurantStatusSchema,
} from '../validators/restaurant.validator';

const router = Router();

// Secure all restaurant endpoints under SUPER_ADMIN role
router.use(authenticate, authorize([UserRole.SUPER_ADMIN]));

router.get('/', validate(listRestaurantsQuerySchema), RestaurantController.list);
router.get('/:id', validate(getRestaurantByIdSchema), RestaurantController.detail);
router.post('/', validate(createRestaurantSchema), RestaurantController.create);
router.put('/:id', validate(updateRestaurantSchema), RestaurantController.update);
router.patch('/:id/status', validate(updateRestaurantStatusSchema), RestaurantController.updateStatus);
router.delete('/:id', validate(getRestaurantByIdSchema), RestaurantController.softDelete);

export default router;
