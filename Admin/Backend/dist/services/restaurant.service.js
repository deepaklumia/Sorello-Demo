"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const restaurant_repository_1 = require("../repositories/restaurant.repository");
const api_error_1 = require("../utils/api-error");
class RestaurantService {
    static async getProfile(restaurantId) {
        const restaurant = await restaurant_repository_1.RestaurantRepository.findById(restaurantId);
        if (!restaurant) {
            throw api_error_1.ApiError.notFound('Restaurant not found');
        }
        const { password, ...safeRestaurant } = restaurant;
        return safeRestaurant;
    }
    static async updateProfile(restaurantId, data) {
        const updated = await restaurant_repository_1.RestaurantRepository.update(restaurantId, data);
        const { password, ...safeRestaurant } = updated;
        return safeRestaurant;
    }
}
exports.RestaurantService = RestaurantService;
exports.default = RestaurantService;
