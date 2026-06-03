"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_controller_1 = require("../controllers/menu.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const menu_validator_1 = require("../validators/menu.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateRestaurant);
// --- Categories ---
router.get('/menu/categories', menu_controller_1.MenuController.getCategories);
router.post('/menu/categories', (0, validate_middleware_1.validate)(menu_validator_1.createCategorySchema), menu_controller_1.MenuController.createCategory);
router.put('/menu/categories/:id', (0, validate_middleware_1.validate)(menu_validator_1.updateCategorySchema), menu_controller_1.MenuController.updateCategory);
router.delete('/menu/categories/:id', (0, validate_middleware_1.validate)(menu_validator_1.getCategoryByIdSchema), menu_controller_1.MenuController.deleteCategory);
// --- Items ---
router.get('/menu/items', menu_controller_1.MenuController.getItems);
router.get('/menu/items/:id', (0, validate_middleware_1.validate)(menu_validator_1.getItemByIdSchema), menu_controller_1.MenuController.getItemById);
router.post('/menu/items', (0, validate_middleware_1.validate)(menu_validator_1.createItemSchema), menu_controller_1.MenuController.createItem);
router.put('/menu/items/:id', (0, validate_middleware_1.validate)(menu_validator_1.updateItemSchema), menu_controller_1.MenuController.updateItem);
router.patch('/menu/items/:id/availability', (0, validate_middleware_1.validate)(menu_validator_1.updateItemAvailabilitySchema), menu_controller_1.MenuController.patchAvailability);
router.delete('/menu/items/:id', (0, validate_middleware_1.validate)(menu_validator_1.getItemByIdSchema), menu_controller_1.MenuController.deleteItem);
exports.default = router;
