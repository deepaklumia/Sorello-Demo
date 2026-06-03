"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoursByIdSchema = exports.updateHoursSchema = exports.createHoursSchema = void 0;
const zod_1 = require("zod");
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
exports.createHoursSchema = zod_1.z.object({
    body: zod_1.z.object({
        dayOfWeek: zod_1.z.number().int().min(0).max(6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'),
        openingTime: zod_1.z.string().regex(timeRegex, 'Opening time must be in HH:MM format (24-hour)'),
        closingTime: zod_1.z.string().regex(timeRegex, 'Closing time must be in HH:MM format (24-hour)'),
        isClosed: zod_1.z.boolean().optional(),
    }),
});
exports.updateHoursSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid hours configuration ID'),
    }),
    body: zod_1.z.object({
        dayOfWeek: zod_1.z.number().int().min(0).max(6).optional(),
        openingTime: zod_1.z.string().regex(timeRegex, 'Opening time must be in HH:MM format (24-hour)').optional(),
        closingTime: zod_1.z.string().regex(timeRegex, 'Closing time must be in HH:MM format (24-hour)').optional(),
        isClosed: zod_1.z.boolean().optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    }),
});
exports.getHoursByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid hours configuration ID'),
    }),
});
exports.default = exports.createHoursSchema;
