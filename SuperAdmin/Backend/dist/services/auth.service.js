"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const env_1 = require("../config/env");
const api_error_1 = require("../utils/api-error");
class AuthService {
    static async register(data) {
        const existing = await database_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw api_error_1.ApiError.badRequest('Email is already registered');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hash = await bcryptjs_1.default.hash(data.password, salt);
        const user = await database_1.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hash,
                name: data.name,
                role: data.role,
            },
        });
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }
    static async login(email, passwordPlain) {
        const user = await database_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw api_error_1.ApiError.unauthorized('Invalid email or password');
        }
        const isMatch = await bcryptjs_1.default.compare(passwordPlain, user.passwordHash);
        if (!isMatch) {
            throw api_error_1.ApiError.unauthorized('Invalid email or password');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
}
exports.AuthService = AuthService;
