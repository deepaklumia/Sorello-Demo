"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRestaurant = void 0;
const jwt_1 = require("../utils/jwt");
const api_error_1 = require("../utils/api-error");
const restaurant_repository_1 = require("../repositories/restaurant.repository");
const authenticateRestaurant = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw api_error_1.ApiError.unauthorized('No authentication token provided');
        }
        const token = authHeader.split(' ')[1];
        let payload;
        try {
            payload = jwt_1.JwtUtils.verifyToken(token);
        }
        catch (err) {
            throw api_error_1.ApiError.unauthorized('Invalid or expired authentication token');
        }
        const restaurant = await restaurant_repository_1.RestaurantRepository.findById(payload.id);
        if (!restaurant) {
            throw api_error_1.ApiError.unauthorized('Restaurant not found');
        }
        if (restaurant.status !== 'ACTIVE') {
            throw api_error_1.ApiError.forbidden(`Restaurant account is ${restaurant.status.toLowerCase()}`);
        }
        if (restaurant.slug !== payload.slug) {
            throw api_error_1.ApiError.unauthorized('Invalid token mapping');
        }
        req.restaurant = restaurant;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticateRestaurant = authenticateRestaurant;
exports.default = exports.authenticateRestaurant;
