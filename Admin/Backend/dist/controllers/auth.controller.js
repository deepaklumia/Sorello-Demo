"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const api_response_1 = require("../utils/api-response");
class AuthController {
    static async login(req, res, next) {
        try {
            const { slug, email, password } = req.body;
            const result = await auth_service_1.AuthService.login(slug, email, password);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Login successful',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { currentPassword, newPassword } = req.body;
            const result = await auth_service_1.AuthService.changePassword(restaurantId, currentPassword, newPassword);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Password changed successfully',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;
