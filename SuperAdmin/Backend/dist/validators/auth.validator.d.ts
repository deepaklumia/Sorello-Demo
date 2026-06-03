import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        passwordPlain: z.ZodString;
        name: z.ZodString;
        role: z.ZodDefault<z.ZodNativeEnum<{
            SUPER_ADMIN: "SUPER_ADMIN";
            RESTAURANT_ADMIN: "RESTAURANT_ADMIN";
            STAFF: "STAFF";
        }>>;
        restaurantId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        role: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF";
        passwordPlain: string;
        restaurantId?: string | undefined;
    }, {
        email: string;
        name: string;
        passwordPlain: string;
        role?: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF" | undefined;
        restaurantId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        name: string;
        role: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF";
        passwordPlain: string;
        restaurantId?: string | undefined;
    };
}, {
    body: {
        email: string;
        name: string;
        passwordPlain: string;
        role?: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF" | undefined;
        restaurantId?: string | undefined;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
