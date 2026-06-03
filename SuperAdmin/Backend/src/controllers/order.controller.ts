import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { sendResponse } from '../utils/api-response';

export class OrderController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page,
        limit,
        restaurantId,
        startDate,
        endDate,
        orderStatus,
        paymentStatus,
      } = req.query as any;

      const { orders, meta } = await OrderService.getAll({
        page,
        limit,
        restaurantId,
        startDate,
        endDate,
        orderStatus,
        paymentStatus,
      });

      sendResponse({
        res,
        message: 'Orders retrieved successfully',
        data: orders,
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await OrderService.getById(id);
      sendResponse({
        res,
        message: 'Order details retrieved successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}
