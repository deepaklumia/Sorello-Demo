"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const restaurant_routes_1 = __importDefault(require("./restaurant.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/admin/restaurants', restaurant_routes_1.default);
router.use('/admin/orders', order_routes_1.default);
router.use('/admin', analytics_routes_1.default);
exports.default = router;
