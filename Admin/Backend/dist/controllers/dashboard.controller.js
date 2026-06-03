"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const order_repository_1 = require("../repositories/order.repository");
const menu_repository_1 = require("../repositories/menu.repository");
const api_response_1 = require("../utils/api-response");
class DashboardController {
    static async getOverview(req, res, next) {
        try {
            const restaurant = req.restaurant;
            const restaurantId = restaurant.id;
            const [stats, totalMenuItems] = await Promise.all([
                order_repository_1.OrderRepository.aggregateStats(restaurantId),
                menu_repository_1.MenuRepository.countItems(restaurantId),
            ]);
            const payload = {
                restaurantName: restaurant.name,
                todayOrders: stats.todayOrders,
                totalOrders: stats.totalOrders,
                todayRevenue: stats.todayRevenue,
                monthlyRevenue: stats.monthlyRevenue,
                totalMenuItems: totalMenuItems,
            };
            (0, api_response_1.sendResponse)({
                res,
                message: 'Dashboard stats retrieved successfully',
                data: payload,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
exports.default = DashboardController;
