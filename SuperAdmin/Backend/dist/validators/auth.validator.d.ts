import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodEffects<z.ZodObject<{
        email: z.ZodString;
        password: z.ZodOptional<z.ZodString>;
        passwordPlain: z.ZodOptional<z.ZodString>;
        passwordHash: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        role: z.ZodDefault<z.ZodNativeEnum<{
            SUPER_ADMIN: "SUPER_ADMIN";
            RESTAURANT_ADMIN: "RESTAURANT_ADMIN";
            STAFF: "STAFF";
        }>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        role: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF";
        passwordHash?: string | undefined;
        password?: string | undefined;
        passwordPlain?: string | undefined;
    }, {
        email: string;
        name: string;
        passwordHash?: string | undefined;
        role?: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF" | undefined;
        password?: string | undefined;
        passwordPlain?: string | undefined;
    }>, {
        email: string;
        name: string;
        role: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF";
        passwordHash?: string | undefined;
        password?: string | undefined;
        passwordPlain?: string | undefined;
    }, {
        email: string;
        name: string;
        passwordHash?: string | undefined;
        role?: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF" | undefined;
        password?: string | undefined;
        passwordPlain?: string | undefined;
    }>, {
        email: string;
        password: string;
        name: string;
        role: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF";
    }, {
        email: string;
        name: string;
        passwordHash?: string | undefined;
        role?: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF" | undefined;
        password?: string | undefined;
        passwordPlain?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
        name: string;
        role: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF";
    };
}, {
    body: {
        email: string;
        name: string;
        passwordHash?: string | undefined;
        role?: "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "STAFF" | undefined;
        password?: string | undefined;
        passwordPlain?: string | undefined;
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
