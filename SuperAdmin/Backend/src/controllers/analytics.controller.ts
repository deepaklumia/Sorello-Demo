import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendResponse } from '../utils/api-response';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AnalyticsService.getDashboardStats();
      sendResponse({
        res,
        message: 'Dashboard statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const revenueData = await AnalyticsService.getRevenueAnalytics();
      sendResponse({
        res,
        message: 'Revenue analytics retrieved successfully',
        data: revenueData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orderData = await AnalyticsService.getOrderAnalytics();
      sendResponse({
        res,
        message: 'Order analytics retrieved successfully',
        data: orderData,
      });
    } catch (error) {
      next(error);
    }
  }
}
