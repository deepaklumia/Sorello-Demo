import { Request, Response, NextFunction } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { sendResponse } from '../utils/api-response';

export class RestaurantController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status } = req.query as any;
      const { restaurants, meta } = await RestaurantService.getAll({
        page,
        limit,
        search,
        status,
      });

      sendResponse({
        res,
        message: 'Restaurants retrieved successfully',
        data: restaurants,
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurant = await RestaurantService.getById(id);
      sendResponse({
        res,
        message: 'Restaurant retrieved successfully',
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = await RestaurantService.create(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Restaurant created successfully',
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurant = await RestaurantService.update(id, req.body);
      sendResponse({
        res,
        message: 'Restaurant updated successfully',
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const restaurant = await RestaurantService.updateStatus(id, status);
      sendResponse({
        res,
        message: 'Restaurant status updated successfully',
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  static async softDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await RestaurantService.softDelete(id);
      sendResponse({
        res,
        message: 'Restaurant deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
