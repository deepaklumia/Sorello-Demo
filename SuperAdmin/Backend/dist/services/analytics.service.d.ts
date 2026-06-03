export declare class AnalyticsService {
    static getDashboardStats(): Promise<{
        totalRestaurants: number;
        activeRestaurants: number;
        totalOrders: number;
        todayOrders: number;
        totalRevenue: number;
        todayRevenue: number;
    }>;
    static getRevenueAnalytics(): Promise<{
        revenueByDay: {
            date: string;
            revenue: number;
        }[];
        revenueByMonth: {
            month: string;
            revenue: number;
        }[];
        revenueByRestaurant: {
            restaurantId: string;
            restaurantName: string;
            revenue: number;
        }[];
    }>;
    static getOrderAnalytics(): Promise<{
        orderTrendsByDay: {
            date: string;
            count: number;
        }[];
        orderTrendsByMonth: {
            month: string;
            count: number;
        }[];
        statusBreakdown: {
            status: string;
            count: number;
        }[];
    }>;
}
