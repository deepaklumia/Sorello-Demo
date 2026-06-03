"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Secure all analytics endpoints under SUPER_ADMIN role
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([client_1.UserRole.SUPER_ADMIN]));
router.get('/dashboard', analytics_controller_1.AnalyticsController.getDashboard);
router.get('/analytics/revenue', analytics_controller_1.AnalyticsController.getRevenue);
router.get('/analytics/orders', analytics_controller_1.AnalyticsController.getOrders);
exports.default = router;
