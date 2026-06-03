"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long').optional(),
        passwordPlain: zod_1.z.string().min(6, 'Password must be at least 6 characters long').optional(),
        passwordHash: zod_1.z.string().min(6, 'Password must be at least 6 characters long').optional(),
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters long'),
        role: zod_1.z.nativeEnum(client_1.UserRole).default(client_1.UserRole.SUPER_ADMIN),
    })
        .refine((data) => data.password || data.passwordPlain || data.passwordHash, {
        message: 'Password is required (as password, passwordPlain, or passwordHash)',
        path: ['password'],
    })
        .transform((data) => ({
        email: data.email,
        password: data.password || data.passwordPlain || data.passwordHash,
        name: data.name,
        role: data.role,
    })),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
