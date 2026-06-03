"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_controller_1 = require("../controllers/restaurant.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const client_1 = require("@prisma/client");
const restaurant_validator_1 = require("../validators/restaurant.validator");
const router = (0, express_1.Router)();
// Secure all restaurant endpoints under SUPER_ADMIN role
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([client_1.UserRole.SUPER_ADMIN]));
router.get('/', (0, validate_middleware_1.validate)(restaurant_validator_1.listRestaurantsQuerySchema), restaurant_controller_1.RestaurantController.list);
router.get('/:id', (0, validate_middleware_1.validate)(restaurant_validator_1.getRestaurantByIdSchema), restaurant_controller_1.RestaurantController.detail);
router.post('/', (0, validate_middleware_1.validate)(restaurant_validator_1.createRestaurantSchema), restaurant_controller_1.RestaurantController.create);
router.put('/:id', (0, validate_middleware_1.validate)(restaurant_validator_1.updateRestaurantSchema), restaurant_controller_1.RestaurantController.update);
router.patch('/:id/status', (0, validate_middleware_1.validate)(restaurant_validator_1.updateRestaurantStatusSchema), restaurant_controller_1.RestaurantController.updateStatus);
router.delete('/:id', (0, validate_middleware_1.validate)(restaurant_validator_1.getRestaurantByIdSchema), restaurant_controller_1.RestaurantController.softDelete);
exports.default = router;
