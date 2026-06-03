import { Router } from 'express';
import { HoursController } from '../controllers/hours.controller';
import { authenticateRestaurant } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createHoursSchema, updateHoursSchema, getHoursByIdSchema } from '../validators/hours.validator';

const router = Router();

router.use(authenticateRestaurant);

router.get('/hours', HoursController.getHours);
router.post('/hours', validate(createHoursSchema), HoursController.createHours);
router.put('/hours/:id', validate(updateHoursSchema), HoursController.updateHours);
router.delete('/hours/:id', validate(getHoursByIdSchema), HoursController.deleteHours);

export default router;
