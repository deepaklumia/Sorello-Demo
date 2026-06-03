"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const api_response_1 = require("../utils/api-response");
class OrderController {
    static async getOrders(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { page, limit, startDate, endDate, orderStatus, paymentStatus } = req.query;
            const result = await order_service_1.OrderService.getOrders(restaurantId, {
                page,
                limit,
                startDate,
                endDate,
                orderStatus,
                paymentStatus,
            });
            (0, api_response_1.sendResponse)({
                res,
                message: 'Orders retrieved successfully',
                data: result.orders,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getOrderById(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            const order = await order_service_1.OrderService.getOrderById(restaurantId, id);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Order retrieved successfully',
                data: order,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
exports.default = OrderController;
