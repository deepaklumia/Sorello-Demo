import { Order, OrderStatus, PaymentStatus } from '@prisma/client';
export declare class OrderRepository {
    static findOrders(restaurantId: string, filters: {
        startDate?: Date;
        endDate?: Date;
        orderStatus?: OrderStatus;
        paymentStatus?: PaymentStatus;
        skip: number;
        take: number;
    }): Promise<[Order[], number]>;
    static findById(restaurantId: string, id: string): Promise<Order | null>;
    static aggregateStats(restaurantId: string): Promise<{
        totalOrders: number;
        todayOrders: number;
        todayRevenue: number;
        monthlyRevenue: number;
    }>;
}
export default OrderRepository;
