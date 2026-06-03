import { Request, Response, NextFunction } from 'express';
import { HoursService } from '../services/hours.service';
import { sendResponse } from '../utils/api-response';

export class HoursController {
  static async getHours(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const hours = await HoursService.getHours(restaurantId);
      sendResponse({
        res,
        message: 'Opening hours retrieved successfully',
        data: hours,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createHours(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const hours = await HoursService.createHours(restaurantId, req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Opening hours created successfully',
        data: hours,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateHours(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      const updated = await HoursService.updateHours(restaurantId, id, req.body);
      sendResponse({
        res,
        message: 'Opening hours updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteHours(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      await HoursService.deleteHours(restaurantId, id);
      sendResponse({
        res,
        message: 'Opening hours deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
export default HoursController;
