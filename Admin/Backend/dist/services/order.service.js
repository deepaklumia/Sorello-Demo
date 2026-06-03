"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_repository_1 = require("../repositories/order.repository");
const api_error_1 = require("../utils/api-error");
class OrderService {
    static async getOrders(restaurantId, params) {
        const pageNum = parseInt(params.page || '1', 10);
        const limitNum = parseInt(params.limit || '10', 10);
        const skip = (pageNum - 1) * limitNum;
        const take = limitNum;
        const filters = {
            startDate: params.startDate ? new Date(params.startDate) : undefined,
            endDate: params.endDate ? new Date(params.endDate) : undefined,
            orderStatus: params.orderStatus,
            paymentStatus: params.paymentStatus,
            skip,
            take,
        };
        const [orders, count] = await order_repository_1.OrderRepository.findOrders(restaurantId, filters);
        const totalPages = Math.ceil(count / limitNum);
        return {
            orders,
            meta: {
                page: pageNum,
                limit: limitNum,
                totalCount: count,
                totalPages,
                hasNextPage: pageNum < totalPages,
                hasPreviousPage: pageNum > 1,
            },
        };
    }
    static async getOrderById(restaurantId, id) {
        const order = await order_repository_1.OrderRepository.findById(restaurantId, id);
        if (!order) {
            throw api_error_1.ApiError.notFound('Order not found');
        }
        return order;
    }
}
exports.OrderService = OrderService;
exports.default = OrderService;
