import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createHoursSchema = z.object({
  body: z.object({
    dayOfWeek: z.number().int().min(0).max(6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'),
    openingTime: z.string().regex(timeRegex, 'Opening time must be in HH:MM format (24-hour)'),
    closingTime: z.string().regex(timeRegex, 'Closing time must be in HH:MM format (24-hour)'),
    isClosed: z.boolean().optional(),
  }),
});

export const updateHoursSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid hours configuration ID'),
  }),
  body: z.object({
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    openingTime: z.string().regex(timeRegex, 'Opening time must be in HH:MM format (24-hour)').optional(),
    closingTime: z.string().regex(timeRegex, 'Closing time must be in HH:MM format (24-hour)').optional(),
    isClosed: z.boolean().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const getHoursByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid hours configuration ID'),
  }),
});
export default createHoursSchema;
