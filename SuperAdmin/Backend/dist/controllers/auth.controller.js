"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const api_response_1 = require("../utils/api-response");
class AuthController {
    static async register(req, res, next) {
        try {
            const user = await auth_service_1.AuthService.register(req.body);
            (0, api_response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'User registered successfully',
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.login(email, password);
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
}
exports.AuthController = AuthController;
