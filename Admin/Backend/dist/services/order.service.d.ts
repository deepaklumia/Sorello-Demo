import { OrderStatus, PaymentStatus } from '@prisma/client';
export declare class OrderService {
    static getOrders(restaurantId: string, params: {
        page?: string;
        limit?: string;
        startDate?: string;
        endDate?: string;
        orderStatus?: OrderStatus;
        paymentStatus?: PaymentStatus;
    }): Promise<{
        orders: {
            id: string;
            createdAt: Date;
            restaurantId: string;
            customerName: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            orderStatus: import(".prisma/client").$Enums.OrderStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        }[];
        meta: {
            page: number;
            limit: number;
            totalCount: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    static getOrderById(restaurantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        restaurantId: string;
        customerName: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
    }>;
}
export default OrderService;
