import { OrderStatus, PaymentStatus } from '@prisma/client';
export declare class OrderService {
    static getAll(params: {
        page?: unknown;
        limit?: unknown;
        restaurantId?: string;
        startDate?: string;
        endDate?: string;
        orderStatus?: OrderStatus;
        paymentStatus?: PaymentStatus;
    }): Promise<{
        orders: ({
            restaurant: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            restaurantId: string;
            createdAt: Date;
            customerName: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            orderStatus: import(".prisma/client").$Enums.OrderStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        })[];
        meta: import("../utils/pagination").PaginationMeta;
    }>;
    static getById(id: string): Promise<{
        restaurant: {
            id: string;
            email: string;
            name: string;
            phone: string;
            address: string;
        };
    } & {
        id: string;
        restaurantId: string;
        createdAt: Date;
        customerName: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
    }>;
}
