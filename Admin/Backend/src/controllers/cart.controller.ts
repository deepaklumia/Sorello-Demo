import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { sendResponse } from '../utils/api-response';

export class CartController {
  static async addItemToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { cartId, menuItemId, quantity, customizations } = req.body;
      const cart = await CartService.addItemToCart(
        restaurantId,
        cartId,
        menuItemId,
        quantity,
        customizations
      );
      sendResponse({
        res,
        statusCode: 200,
        message: 'Item added to cart successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      const cart = await CartService.getCart(restaurantId, id);
      sendResponse({
        res,
        message: 'Cart retrieved successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id, itemId } = req.params;
      const { quantity, customizations } = req.body;
      const cart = await CartService.updateCartItem(
        restaurantId,
        id,
        itemId,
        quantity,
        customizations
      );
      sendResponse({
        res,
        message: 'Cart item updated successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeItemFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id, itemId } = req.params;
      const cart = await CartService.removeItemFromCart(restaurantId, id, itemId);
      sendResponse({
        res,
        message: 'Cart item removed successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;
      const result = await CartService.clearCart(restaurantId, id);
      sendResponse({
        res,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default CartController;
