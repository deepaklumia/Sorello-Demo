"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
class AnalyticsService {
    static async getDashboardStats() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const [totalRestaurants, activeRestaurants, totalOrders, todayOrders, totalRevenueAgg, todayRevenueAgg,] = await Promise.all([
            database_1.prisma.restaurant.count({
                where: { deletedAt: null },
            }),
            database_1.prisma.restaurant.count({
                where: { status: client_1.RestaurantStatus.ACTIVE, deletedAt: null },
            }),
            database_1.prisma.order.count(),
            database_1.prisma.order.count({
                where: {
                    createdAt: {
                        gte: startOfToday,
                        lte: endOfToday,
                    },
                },
            }),
            database_1.prisma.order.aggregate({
                where: {
                    paymentStatus: client_1.PaymentStatus.PAID,
                },
                _sum: {
                    totalAmount: true,
                },
            }),
            database_1.prisma.order.aggregate({
                where: {
                    paymentStatus: client_1.PaymentStatus.PAID,
                    createdAt: {
                        gte: startOfToday,
                        lte: endOfToday,
                    },
                },
                _sum: {
                    totalAmount: true,
                },
            }),
        ]);
        const totalRevenue = totalRevenueAgg._sum.totalAmount
            ? Number(totalRevenueAgg._sum.totalAmount)
            : 0;
        const todayRevenue = todayRevenueAgg._sum.totalAmount
            ? Number(todayRevenueAgg._sum.totalAmount)
            : 0;
        return {
            totalRestaurants,
            activeRestaurants,
            totalOrders,
            todayOrders,
            totalRevenue,
            todayRevenue,
        };
    }
    static async getRevenueAnalytics() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);
        const [dailyRevenueRaw, monthlyRevenueRaw, restaurantRevenueRaw] = await Promise.all([
            database_1.prisma.order.findMany({
                where: {
                    paymentStatus: client_1.PaymentStatus.PAID,
                    createdAt: { gte: thirtyDaysAgo },
                },
                select: {
                    createdAt: true,
                    totalAmount: true,
                },
            }),
            database_1.prisma.order.findMany({
                where: {
                    paymentStatus: client_1.PaymentStatus.PAID,
                    createdAt: { gte: twelveMonthsAgo },
                },
                select: {
                    createdAt: true,
                    totalAmount: true,
                },
            }),
            database_1.prisma.order.groupBy({
                by: ['restaurantId'],
                where: {
                    paymentStatus: client_1.PaymentStatus.PAID,
                },
                _sum: {
                    totalAmount: true,
                },
            }),
        ]);
        // Group Daily Revenue
        const dailyRevenueMap = {};
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailyRevenueMap[dateStr] = 0;
        }
        dailyRevenueRaw.forEach((order) => {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            if (dailyRevenueMap[dateStr] !== undefined) {
                dailyRevenueMap[dateStr] += Number(order.totalAmount);
            }
        });
        const revenueByDay = Object.keys(dailyRevenueMap)
            .sort()
            .map((date) => ({
            date,
            revenue: Number(dailyRevenueMap[date].toFixed(2)),
        }));
        // Group Monthly Revenue
        const monthlyRevenueMap = {};
        for (let i = 0; i < 12; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyRevenueMap[monthStr] = 0;
        }
        monthlyRevenueRaw.forEach((order) => {
            const date = order.createdAt;
            const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyRevenueMap[monthStr] !== undefined) {
                monthlyRevenueMap[monthStr] += Number(order.totalAmount);
            }
        });
        const revenueByMonth = Object.keys(monthlyRevenueMap)
            .sort()
            .map((month) => ({
            month,
            revenue: Number(monthlyRevenueMap[month].toFixed(2)),
        }));
        // Group Revenue by Restaurant
        const restaurants = await database_1.prisma.restaurant.findMany({
            where: {
                id: { in: restaurantRevenueRaw.map((r) => r.restaurantId) },
            },
            select: {
                id: true,
                name: true,
            },
        });
        const restaurantNameMap = new Map(restaurants.map((r) => [r.id, r.name]));
        const revenueByRestaurant = restaurantRevenueRaw
            .map((item) => ({
            restaurantId: item.restaurantId,
            restaurantName: restaurantNameMap.get(item.restaurantId) || 'Unknown Restaurant',
            revenue: item._sum.totalAmount ? Number(Number(item._sum.totalAmount).toFixed(2)) : 0,
        }))
            .sort((a, b) => b.revenue - a.revenue);
        return {
            revenueByDay,
            revenueByMonth,
            revenueByRestaurant,
        };
    }
    static async getOrderAnalytics() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);
        const [ordersLast30Days, ordersLast12Months, orderStatusCounts] = await Promise.all([
            database_1.prisma.order.findMany({
                where: { createdAt: { gte: thirtyDaysAgo } },
                select: { createdAt: true },
            }),
            database_1.prisma.order.findMany({
                where: { createdAt: { gte: twelveMonthsAgo } },
                select: { createdAt: true },
            }),
            database_1.prisma.order.groupBy({
                by: ['orderStatus'],
                _count: { id: true },
            }),
        ]);
        // Group Daily Order Counts
        const dailyCountMap = {};
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailyCountMap[dateStr] = 0;
        }
        ordersLast30Days.forEach((o) => {
            const dateStr = o.createdAt.toISOString().split('T')[0];
            if (dailyCountMap[dateStr] !== undefined) {
                dailyCountMap[dateStr]++;
            }
        });
        const orderTrendsByDay = Object.keys(dailyCountMap)
            .sort()
            .map((date) => ({ date, count: dailyCountMap[date] }));
        // Group Monthly Order Counts
        const monthlyCountMap = {};
        for (let i = 0; i < 12; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyCountMap[monthStr] = 0;
        }
        ordersLast12Months.forEach((o) => {
            const date = o.createdAt;
            const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyCountMap[monthStr] !== undefined) {
                monthlyCountMap[monthStr]++;
            }
        });
        const orderTrendsByMonth = Object.keys(monthlyCountMap)
            .sort()
            .map((month) => ({ month, count: monthlyCountMap[month] }));
        // Format Status Breakdown
        const orderStatusMap = {};
        Object.values(client_1.OrderStatus).forEach((status) => {
            orderStatusMap[status] = 0;
        });
        orderStatusCounts.forEach((item) => {
            orderStatusMap[item.orderStatus] = item._count.id;
        });
        const statusBreakdown = Object.keys(orderStatusMap).map((status) => ({
            status,
            count: orderStatusMap[status] || 0,
        }));
        return {
            orderTrendsByDay,
            orderTrendsByMonth,
            statusBreakdown,
        };
    }
}
exports.AnalyticsService = AnalyticsService;
