"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRestaurantsQuerySchema = exports.getRestaurantByIdSchema = exports.updateRestaurantStatusSchema = exports.updateRestaurantSchema = exports.createRestaurantSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createRestaurantSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters long'),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().min(5, 'Phone number is too short'),
        address: zod_1.z.string().min(5, 'Address must be at least 5 characters long'),
        status: zod_1.z.nativeEnum(client_1.RestaurantStatus).optional(),
        subscriptionPlan: zod_1.z.string().min(1, 'Subscription plan is required'),
        slug: zod_1.z.string().min(2, 'Slug must be at least 2 characters long')
            .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and dashes')
            .optional(),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long').optional(),
    }),
});
exports.updateRestaurantSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid restaurant ID format'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters long').optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        phone: zod_1.z.string().min(5, 'Phone number is too short').optional(),
        address: zod_1.z.string().min(5, 'Address must be at least 5 characters long').optional(),
        subscriptionPlan: zod_1.z.string().min(1, 'Subscription plan cannot be empty').optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    }),
});
exports.updateRestaurantStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid restaurant ID format'),
    }),
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.RestaurantStatus, {
            errorMap: () => ({ message: 'Status must be one of: ACTIVE, INACTIVE, SUSPENDED' }),
        }),
    }),
});
exports.getRestaurantByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid restaurant ID format'),
    }),
});
exports.listRestaurantsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(client_1.RestaurantStatus).optional(),
    }),
});
