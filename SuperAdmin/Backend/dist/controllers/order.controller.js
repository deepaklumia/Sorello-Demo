"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const api_response_1 = require("../utils/api-response");
class OrderController {
    static async list(req, res, next) {
        try {
            const { page, limit, restaurantId, startDate, endDate, orderStatus, paymentStatus, } = req.query;
            const { orders, meta } = await order_service_1.OrderService.getAll({
                page,
                limit,
                restaurantId,
                startDate,
                endDate,
                orderStatus,
                paymentStatus,
            });
            (0, api_response_1.sendResponse)({
                res,
                message: 'Orders retrieved successfully',
                data: orders,
                meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async detail(req, res, next) {
        try {
            const { id } = req.params;
            const order = await order_service_1.OrderService.getById(id);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Order details retrieved successfully',
                data: order,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
