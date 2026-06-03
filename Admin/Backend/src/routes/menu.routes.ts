import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { authenticateRestaurant } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
  createItemSchema,
  updateItemSchema,
  getItemByIdSchema,
  updateItemAvailabilitySchema,
} from '../validators/menu.validator';

const router = Router();

router.use(authenticateRestaurant);

// --- Categories ---
router.get('/menu/categories', MenuController.getCategories);
router.post('/menu/categories', validate(createCategorySchema), MenuController.createCategory);
router.put('/menu/categories/:id', validate(updateCategorySchema), MenuController.updateCategory);
router.delete('/menu/categories/:id', validate(getCategoryByIdSchema), MenuController.deleteCategory);

// --- Items ---
router.get('/menu/items', MenuController.getItems);
router.get('/menu/items/:id', validate(getItemByIdSchema), MenuController.getItemById);
router.post('/menu/items', validate(createItemSchema), MenuController.createItem);
router.put('/menu/items/:id', validate(updateItemSchema), MenuController.updateItem);
router.patch('/menu/items/:id/availability', validate(updateItemAvailabilitySchema), MenuController.patchAvailability);
router.delete('/menu/items/:id', validate(getItemByIdSchema), MenuController.deleteItem);

export default router;
