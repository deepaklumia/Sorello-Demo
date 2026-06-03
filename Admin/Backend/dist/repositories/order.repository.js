"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
class OrderRepository {
    static async findOrders(restaurantId, filters) {
        const where = {
            restaurantId,
        };
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) {
                where.createdAt.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.createdAt.lte = filters.endDate;
            }
        }
        if (filters.orderStatus) {
            where.orderStatus = filters.orderStatus;
        }
        if (filters.paymentStatus) {
            where.paymentStatus = filters.paymentStatus;
        }
        const [orders, count] = await Promise.all([
            database_1.prisma.order.findMany({
                where,
                skip: filters.skip,
                take: filters.take,
                orderBy: { createdAt: 'desc' },
            }),
            database_1.prisma.order.count({ where }),
        ]);
        return [orders, count];
    }
    static async findById(restaurantId, id) {
        return database_1.prisma.order.findFirst({
            where: { id, restaurantId },
        });
    }
    static async aggregateStats(restaurantId) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfThisMonth = new Date();
        startOfThisMonth.setDate(1);
        startOfThisMonth.setHours(0, 0, 0, 0);
        const [totalOrders, todayOrders, todayOrdersList, monthlyOrdersList] = await Promise.all([
            database_1.prisma.order.count({ where: { restaurantId } }),
            database_1.prisma.order.count({
                where: {
                    restaurantId,
                    createdAt: { gte: startOfToday },
                },
            }),
            database_1.prisma.order.findMany({
                where: {
                    restaurantId,
                    createdAt: { gte: startOfToday },
                    orderStatus: client_1.OrderStatus.COMPLETED,
                },
                select: { totalAmount: true },
            }),
            database_1.prisma.order.findMany({
                where: {
                    restaurantId,
                    createdAt: { gte: startOfThisMonth },
                    orderStatus: client_1.OrderStatus.COMPLETED,
                },
                select: { totalAmount: true },
            }),
        ]);
        const todayRevenue = todayOrdersList.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
        const monthlyRevenue = monthlyOrdersList.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
        return {
            totalOrders,
            todayOrders,
            todayRevenue,
            monthlyRevenue,
        };
    }
}
exports.OrderRepository = OrderRepository;
exports.default = OrderRepository;
