import { z } from 'zod';
export declare const getOrderByIdSchema: z.ZodObject<{
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
export declare const listOrdersQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        restaurantId: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        endDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        orderStatus: z.ZodOptional<z.ZodNativeEnum<{
            PENDING: "PENDING";
            ACCEPTED: "ACCEPTED";
            PREPARED: "PREPARED";
            COMPLETED: "COMPLETED";
            DECLINED: "DECLINED";
        }>>;
        paymentStatus: z.ZodOptional<z.ZodNativeEnum<{
            PENDING: "PENDING";
            PAID: "PAID";
            FAILED: "FAILED";
            REFUNDED: "REFUNDED";
        }>>;
    }, "strip", z.ZodTypeAny, {
        restaurantId?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        orderStatus?: "PENDING" | "ACCEPTED" | "PREPARED" | "COMPLETED" | "DECLINED" | undefined;
        paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        restaurantId?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        orderStatus?: "PENDING" | "ACCEPTED" | "PREPARED" | "COMPLETED" | "DECLINED" | undefined;
        paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        restaurantId?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        orderStatus?: "PENDING" | "ACCEPTED" | "PREPARED" | "COMPLETED" | "DECLINED" | undefined;
        paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        restaurantId?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        orderStatus?: "PENDING" | "ACCEPTED" | "PREPARED" | "COMPLETED" | "DECLINED" | undefined;
        paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
