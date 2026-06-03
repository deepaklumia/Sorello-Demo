"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const restaurant_routes_1 = __importDefault(require("./restaurant.routes"));
const menu_routes_1 = __importDefault(require("./menu.routes"));
const hours_routes_1 = __importDefault(require("./hours.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Authentication endpoints
router.use('/restaurant-auth', auth_routes_1.default);
// Tenant-scoped endpoints
router.use('/restaurant', restaurant_routes_1.default);
router.use('/restaurant', menu_routes_1.default);
router.use('/restaurant', hours_routes_1.default);
router.use('/restaurant', order_routes_1.default);
// Dashboard overview
router.get('/restaurant/dashboard', auth_middleware_1.authenticateRestaurant, dashboard_controller_1.DashboardController.getOverview);
exports.default = router;
