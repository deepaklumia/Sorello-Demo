import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    }, {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    }>, {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    }, {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    };
}>;
