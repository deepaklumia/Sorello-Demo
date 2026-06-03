"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
const api_response_1 = require("../utils/api-response");
class AnalyticsController {
    static async getDashboard(req, res, next) {
        try {
            const stats = await analytics_service_1.AnalyticsService.getDashboardStats();
            (0, api_response_1.sendResponse)({
                res,
                message: 'Dashboard statistics retrieved successfully',
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getRevenue(req, res, next) {
        try {
            const revenueData = await analytics_service_1.AnalyticsService.getRevenueAnalytics();
            (0, api_response_1.sendResponse)({
                res,
                message: 'Revenue analytics retrieved successfully',
                data: revenueData,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getOrders(req, res, next) {
        try {
            const orderData = await analytics_service_1.AnalyticsService.getOrderAnalytics();
            (0, api_response_1.sendResponse)({
                res,
                message: 'Order analytics retrieved successfully',
                data: orderData,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
