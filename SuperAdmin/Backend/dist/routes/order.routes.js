"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const client_1 = require("@prisma/client");
const order_validator_1 = require("../validators/order.validator");
const router = (0, express_1.Router)();
// Secure all order endpoints under SUPER_ADMIN role
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([client_1.UserRole.SUPER_ADMIN]));
router.get('/', (0, validate_middleware_1.validate)(order_validator_1.listOrdersQuerySchema), order_controller_1.OrderController.list);
router.get('/:id', (0, validate_middleware_1.validate)(order_validator_1.getOrderByIdSchema), order_controller_1.OrderController.detail);
exports.default = router;
