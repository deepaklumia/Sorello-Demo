"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const api_error_1 = require("../utils/api-error");
const database_1 = require("../config/database");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw api_error_1.ApiError.unauthorized('Access token is missing or invalid');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw api_error_1.ApiError.unauthorized('Access token is missing');
        }
        let decodedPayload;
        try {
            decodedPayload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        }
        catch (err) {
            throw api_error_1.ApiError.unauthorized('Invalid or expired access token');
        }
        const userId = decodedPayload.id || decodedPayload.userId || decodedPayload.sub;
        if (!userId) {
            throw api_error_1.ApiError.unauthorized('Invalid token payload');
        }
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        if (!user) {
            throw api_error_1.ApiError.unauthorized('User not found or account deactivated');
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw api_error_1.ApiError.unauthorized('User not authenticated');
            }
            if (!roles.includes(req.user.role)) {
                throw api_error_1.ApiError.forbidden('You do not have permission to access this resource');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
