import { Request, Response, NextFunction } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { sendResponse } from '../utils/api-response';

export class RestaurantController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const profile = await RestaurantService.getProfile(restaurantId);
      sendResponse({
        res,
        message: 'Profile retrieved successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { name, phone, address } = req.body;
      const updated = await RestaurantService.updateProfile(restaurantId, { name, phone, address });
      sendResponse({
        res,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default RestaurantController;
