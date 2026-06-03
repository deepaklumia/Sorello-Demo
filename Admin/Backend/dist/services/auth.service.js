"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const restaurant_repository_1 = require("../repositories/restaurant.repository");
const api_error_1 = require("../utils/api-error");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async login(slug, email, passwordPlain) {
        const restaurant = await restaurant_repository_1.RestaurantRepository.findBySlug(slug);
        if (!restaurant) {
            throw api_error_1.ApiError.unauthorized('Invalid restaurant slug, email, or password');
        }
        if (restaurant.email !== email) {
            throw api_error_1.ApiError.unauthorized('Invalid restaurant slug, email, or password');
        }
        if (restaurant.status !== 'ACTIVE') {
            throw api_error_1.ApiError.forbidden(`Restaurant account status is ${restaurant.status.toLowerCase()}`);
        }
        const isMatch = await bcryptjs_1.default.compare(passwordPlain, restaurant.password);
        if (!isMatch) {
            throw api_error_1.ApiError.unauthorized('Invalid restaurant slug, email, or password');
        }
        const token = jwt_1.JwtUtils.generateAccessToken({
            id: restaurant.id,
            email: restaurant.email,
            slug: restaurant.slug,
        });
        const refreshToken = jwt_1.JwtUtils.generateRefreshToken({
            id: restaurant.id,
            email: restaurant.email,
            slug: restaurant.slug,
        });
        return {
            token,
            refreshToken,
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                slug: restaurant.slug,
                email: restaurant.email,
            },
        };
    }
    static async changePassword(restaurantId, currentPasswordPlain, newPasswordPlain) {
        const restaurant = await restaurant_repository_1.RestaurantRepository.findById(restaurantId);
        if (!restaurant) {
            throw api_error_1.ApiError.notFound('Restaurant not found');
        }
        const isMatch = await bcryptjs_1.default.compare(currentPasswordPlain, restaurant.password);
        if (!isMatch) {
            throw api_error_1.ApiError.badRequest('Current password is incorrect');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const newPasswordHash = await bcryptjs_1.default.hash(newPasswordPlain, salt);
        await restaurant_repository_1.RestaurantRepository.update(restaurantId, { password: newPasswordHash });
        return {
            message: 'Password changed successfully',
        };
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
