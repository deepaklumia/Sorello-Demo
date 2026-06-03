import { z } from 'zod';
export declare const listOrdersQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
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
        orderStatus?: "PENDING" | "ACCEPTED" | "PREPARED" | "COMPLETED" | "DECLINED" | undefined;
        paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        orderStatus?: "PENDING" | "ACCEPTED" | "PREPARED" | "COMPLETED" | "DECLINED" | undefined;
        paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        orderStatus?: "PENDING" | "ACCEPTED" | "PREPARED" | "COMPLETED" | "DECLINED" | undefined;
        paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        orderStatus?: "PENDING" | "ACCEPTED" | "PREPARED" | "COMPLETED" | "DECLINED" | undefined;
        paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
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
export default listOrdersQuerySchema;
