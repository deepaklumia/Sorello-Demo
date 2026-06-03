import { z } from 'zod';
export declare const createHoursSchema: z.ZodObject<{
    body: z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        openingTime: z.ZodString;
        closingTime: z.ZodString;
        isClosed: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed?: boolean | undefined;
    }, {
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed?: boolean | undefined;
    };
}, {
    body: {
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed?: boolean | undefined;
    };
}>;
export declare const updateHoursSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
        isClosed: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        dayOfWeek?: number | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        isClosed?: boolean | undefined;
    }, {
        dayOfWeek?: number | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        isClosed?: boolean | undefined;
    }>, {
        dayOfWeek?: number | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        isClosed?: boolean | undefined;
    }, {
        dayOfWeek?: number | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        isClosed?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        dayOfWeek?: number | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        isClosed?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        dayOfWeek?: number | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        isClosed?: boolean | undefined;
    };
}>;
export declare const getHoursByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export default createHoursSchema;
