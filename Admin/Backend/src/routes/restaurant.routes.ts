import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { authenticateRestaurant } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../validators/restaurant.validator';

const router = Router();

router.use(authenticateRestaurant);

router.get('/profile', RestaurantController.getProfile);
router.put('/profile', validate(updateProfileSchema), RestaurantController.updateProfile);

export default router;
