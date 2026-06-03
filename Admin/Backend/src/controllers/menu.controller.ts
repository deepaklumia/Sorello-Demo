import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service';
import { sendResponse } from '../utils/api-response';

export class MenuController {
  // --- Categories ---

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const categories = await MenuService.getCategories(restaurantId);
      sendResponse({
        res,
        message: 'Menu categories retrieved successfully',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { name, description } = req.body;
      const category = await MenuService.createCategory(restaurantId, name, description);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Menu category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      const { name, description } = req.body;
      const updated = await MenuService.updateCategory(restaurantId, id, name, description);
      sendResponse({
        res,
        message: 'Menu category updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      await MenuService.deleteCategory(restaurantId, id);
      sendResponse({
        res,
        message: 'Menu category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Items ---

  static async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const items = await MenuService.getItems(restaurantId);
      sendResponse({
        res,
        message: 'Menu items retrieved successfully',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      const item = await MenuService.getItemById(restaurantId, id);
      sendResponse({
        res,
        message: 'Menu item retrieved successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const item = await MenuService.createItem(restaurantId, req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Menu item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      const updated = await MenuService.updateItem(restaurantId, id, req.body);
      sendResponse({
        res,
        message: 'Menu item updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      const { isAvailable } = req.body;
      const updated = await MenuService.toggleAvailability(restaurantId, id, isAvailable);
      sendResponse({
        res,
        message: 'Menu item availability status updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      await MenuService.deleteItem(restaurantId, id);
      sendResponse({
        res,
        message: 'Menu item deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
export default MenuController;
