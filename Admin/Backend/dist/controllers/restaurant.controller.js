"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const restaurant_service_1 = require("../services/restaurant.service");
const api_response_1 = require("../utils/api-response");
class RestaurantController {
    static async getProfile(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const profile = await restaurant_service_1.RestaurantService.getProfile(restaurantId);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Profile retrieved successfully',
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { name, phone, address } = req.body;
            const updated = await restaurant_service_1.RestaurantService.updateProfile(restaurantId, { name, phone, address });
            (0, api_response_1.sendResponse)({
                res,
                message: 'Profile updated successfully',
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RestaurantController = RestaurantController;
exports.default = RestaurantController;
