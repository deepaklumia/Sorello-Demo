"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemAvailabilitySchema = exports.getItemByIdSchema = exports.updateItemSchema = exports.createItemSchema = exports.getCategoryByIdSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Category name is required'),
        description: zod_1.z.string().optional(),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid category ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Category name cannot be empty').optional(),
        description: zod_1.z.string().optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    }),
});
exports.getCategoryByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid category ID'),
    }),
});
exports.createItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        categoryId: zod_1.z.string().uuid('Invalid category ID'),
        name: zod_1.z.string().min(1, 'Item name is required'),
        description: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().url('Invalid image URL').optional().or(zod_1.z.literal('')),
        price: zod_1.z.number().positive('Price must be greater than zero'),
        preparationTime: zod_1.z.number().int().nonnegative('Preparation time must be a non-negative integer'),
        isAvailable: zod_1.z.boolean().optional(),
    }),
});
exports.updateItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid item ID'),
    }),
    body: zod_1.z.object({
        categoryId: zod_1.z.string().uuid('Invalid category ID').optional(),
        name: zod_1.z.string().min(1, 'Item name cannot be empty').optional(),
        description: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().url('Invalid image URL').optional().or(zod_1.z.literal('')),
        price: zod_1.z.number().positive('Price must be greater than zero').optional(),
        preparationTime: zod_1.z.number().int().nonnegative('Preparation time must be a non-negative integer').optional(),
        isAvailable: zod_1.z.boolean().optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    }),
});
exports.getItemByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid item ID'),
    }),
});
exports.updateItemAvailabilitySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid item ID'),
    }),
    body: zod_1.z.object({
        isAvailable: zod_1.z.boolean({
            required_error: 'Availability status is required',
        }),
    }),
});
exports.default = exports.createCategorySchema;
