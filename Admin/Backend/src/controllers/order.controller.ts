import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { sendResponse } from '../utils/api-response';

export class OrderController {
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { page, limit, startDate, endDate, orderStatus, paymentStatus } = req.query as any;
      const result = await OrderService.getOrders(restaurantId, {
        page,
        limit,
        startDate,
        endDate,
        orderStatus,
        paymentStatus,
      });
      sendResponse({
        res,
        message: 'Orders retrieved successfully',
        data: result.orders,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      const order = await OrderService.getOrderById(restaurantId, id);
      sendResponse({
        res,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default OrderController;
