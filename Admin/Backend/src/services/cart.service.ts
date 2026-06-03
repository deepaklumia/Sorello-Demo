import { CartRepository } from '../repositories/cart.repository';
import { ApiError } from '../utils/api-error';
import { prisma } from '../config/database';

export class CartService {
  static async addItemToCart(
    restaurantId: string,
    cartId: string | undefined,
    menuItemId: string,
    quantity: number,
    customizations?: string
  ) {
    // 1. Verify menu item exists and is active for this restaurant
    const menuItem = await prisma.menuItem.findFirst({
      where: { id: menuItemId, restaurantId, isAvailable: true },
    });
    if (!menuItem) {
      throw ApiError.notFound('Menu item not found or is currently unavailable');
    }

    let cart;
    if (cartId) {
      cart = await CartRepository.findCartById(restaurantId, cartId);
      if (!cart) {
        // If cartId provided but not found, create a new cart
        cart = await CartRepository.createCart(restaurantId);
      }
    } else {
      cart = await CartRepository.createCart(restaurantId);
    }

    // 2. Check for duplicate item with same customizations
    const existingItem = await CartRepository.findCartItem(cart.id, menuItemId, customizations);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      await CartRepository.updateCartItemQty(existingItem.id, newQuantity);
    } else {
      await CartRepository.addCartItem(cart.id, menuItemId, quantity, customizations);
    }

    // 3. Return updated cart details
    const updatedCart = await CartRepository.findCartById(restaurantId, cart.id);
    if (!updatedCart) {
      throw ApiError.notFound('Updated cart could not be loaded');
    }
    return updatedCart;
  }

  static async getCart(restaurantId: string, cartId: string) {
    const cart = await CartRepository.findCartById(restaurantId, cartId);
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }
    return cart;
  }

  static async updateCartItem(
    restaurantId: string,
    cartId: string,
    cartItemId: string,
    quantity: number,
    customizations?: string
  ) {
    const cart = await CartRepository.findCartById(restaurantId, cartId);
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    const hasItem = cart.items.some((i) => i.id === cartItemId);
    if (!hasItem) {
      throw ApiError.notFound('Cart item not found in the specified cart');
    }

    await CartRepository.updateCartItem(cartItemId, quantity, customizations);

    const updatedCart = await CartRepository.findCartById(restaurantId, cartId);
    if (!updatedCart) {
      throw ApiError.notFound('Updated cart could not be loaded');
    }
    return updatedCart;
  }

  static async removeItemFromCart(restaurantId: string, cartId: string, cartItemId: string) {
    const cart = await CartRepository.findCartById(restaurantId, cartId);
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    const hasItem = cart.items.some((i) => i.id === cartItemId);
    if (!hasItem) {
      throw ApiError.notFound('Cart item not found in the specified cart');
    }

    await CartRepository.removeCartItem(cartItemId);

    const updatedCart = await CartRepository.findCartById(restaurantId, cartId);
    if (!updatedCart) {
      throw ApiError.notFound('Updated cart could not be loaded');
    }
    return updatedCart;
  }

  static async clearCart(restaurantId: string, cartId: string) {
    const cart = await CartRepository.findCartById(restaurantId, cartId);
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    await CartRepository.deleteCart(restaurantId, cartId);
    return { message: 'Cart deleted and emptied successfully' };
  }
}
export default CartService;
