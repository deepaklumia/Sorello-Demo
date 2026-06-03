import { prisma } from '../config/database';

export class CartRepository {
  static async createCart(restaurantId: string) {
    return prisma.cart.create({
      data: {
        restaurantId,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  static async findCartById(restaurantId: string, cartId: string) {
    return prisma.cart.findFirst({
      where: { id: cartId, restaurantId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  static async findCartItem(cartId: string, menuItemId: string, customizations?: string | null) {
    return prisma.cartItem.findFirst({
      where: {
        cartId,
        menuItemId,
        customizations: customizations || null,
      },
    });
  }

  static async addCartItem(cartId: string, menuItemId: string, quantity: number, customizations?: string | null) {
    return prisma.cartItem.create({
      data: {
        cartId,
        menuItemId,
        quantity,
        customizations: customizations || null,
      },
    });
  }

  static async updateCartItemQty(cartItemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  static async updateCartItem(cartItemId: string, quantity: number, customizations?: string | null) {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity,
        customizations: customizations !== undefined ? customizations : undefined,
      },
    });
  }

  static async removeCartItem(cartItemId: string) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  static async deleteCart(restaurantId: string, cartId: string) {
    return prisma.cart.delete({
      where: { id: cartId, restaurantId },
    });
  }
}
export default CartRepository;
