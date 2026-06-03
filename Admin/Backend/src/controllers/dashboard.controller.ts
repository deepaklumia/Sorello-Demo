import { Request, Response, NextFunction } from 'express';
import { OrderRepository } from '../repositories/order.repository';
import { MenuRepository } from '../repositories/menu.repository';
import { sendResponse } from '../utils/api-response';

export class DashboardController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = req.restaurant!;
      const restaurantId = restaurant.id;

      const [stats, totalMenuItems] = await Promise.all([
        OrderRepository.aggregateStats(restaurantId),
        MenuRepository.countItems(restaurantId),
      ]);

      const payload = {
        restaurantName: restaurant.name,
        todayOrders: stats.todayOrders,
        totalOrders: stats.totalOrders,
        todayRevenue: stats.todayRevenue,
        monthlyRevenue: stats.monthlyRevenue,
        totalMenuItems: totalMenuItems,
      };

      sendResponse({
        res,
        message: 'Dashboard stats retrieved successfully',
        data: payload,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default DashboardController;
