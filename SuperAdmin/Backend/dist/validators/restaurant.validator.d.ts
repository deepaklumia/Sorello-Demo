import { z } from 'zod';
export declare const createRestaurantSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        address: z.ZodString;
        status: z.ZodOptional<z.ZodNativeEnum<{
            ACTIVE: "ACTIVE";
            INACTIVE: "INACTIVE";
            SUSPENDED: "SUSPENDED";
        }>>;
        subscriptionPlan: z.ZodString;
        slug: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        phone: string;
        address: string;
        subscriptionPlan: string;
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
        password?: string | undefined;
        slug?: string | undefined;
    }, {
        email: string;
        name: string;
        phone: string;
        address: string;
        subscriptionPlan: string;
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
        password?: string | undefined;
        slug?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        name: string;
        phone: string;
        address: string;
        subscriptionPlan: string;
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
        password?: string | undefined;
        slug?: string | undefined;
    };
}, {
    body: {
        email: string;
        name: string;
        phone: string;
        address: string;
        subscriptionPlan: string;
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
        password?: string | undefined;
        slug?: string | undefined;
    };
}>;
export declare const updateRestaurantSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        subscriptionPlan: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        subscriptionPlan?: string | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        subscriptionPlan?: string | undefined;
    }>, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        subscriptionPlan?: string | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        subscriptionPlan?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        subscriptionPlan?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        subscriptionPlan?: string | undefined;
    };
}>;
export declare const updateRestaurantStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodNativeEnum<{
            ACTIVE: "ACTIVE";
            INACTIVE: "INACTIVE";
            SUSPENDED: "SUSPENDED";
        }>;
    }, "strip", z.ZodTypeAny, {
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    }, {
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    };
}>;
export declare const getRestaurantByIdSchema: z.ZodObject<{
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
export declare const listRestaurantsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodNativeEnum<{
            ACTIVE: "ACTIVE";
            INACTIVE: "INACTIVE";
            SUSPENDED: "SUSPENDED";
        }>>;
    }, "strip", z.ZodTypeAny, {
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
    }, {
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
    };
}, {
    query: {
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
    };
}>;
