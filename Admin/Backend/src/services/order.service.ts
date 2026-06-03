import { OrderRepository } from '../repositories/order.repository';
import { CartRepository } from '../repositories/cart.repository';
import { ApiError } from '../utils/api-error';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { getIo } from '../utils/socket';


export class OrderService {
  static async getOrders(
    restaurantId: string,
    params: {
      page?: string;
      limit?: string;
      startDate?: string;
      endDate?: string;
      orderStatus?: OrderStatus;
      paymentStatus?: PaymentStatus;
    }
  ) {
    const pageNum = parseInt(params.page || '1', 10);
    const limitNum = parseInt(params.limit || '10', 10);
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const filters = {
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      orderStatus: params.orderStatus,
      paymentStatus: params.paymentStatus,
      skip,
      take,
    };

    const [orders, count] = await OrderRepository.findOrders(restaurantId, filters);

    const totalPages = Math.ceil(count / limitNum);

    return {
      orders,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalCount: count,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
      },
    };
  }

  static async getOrderById(restaurantId: string, id: string) {
    const order = await OrderRepository.findById(restaurantId, id);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }
    return order;
  }

  static async createOrder(restaurantId: string, customerName: string, cartId: string) {
    const cart = await CartRepository.findCartById(restaurantId, cartId);
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    if (cart.items.length === 0) {
      throw ApiError.badRequest('Cart is empty. Cannot place an order.');
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => {
      if (!item.menuItem) return sum;
      return sum + Number(item.menuItem.price) * item.quantity;
    }, 0);

    const cartItems = cart.items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: Number(item.menuItem.price),
      customizations: item.customizations,
    }));

    const order = await OrderRepository.createOrder(
      restaurantId,
      customerName,
      totalAmount,
      cartItems,
      cartId
    );

    // Emit Socket.io event for real-time Order Creation
    const io = getIo();
    if (io) {
      io.to(restaurantId).emit('new-order', order);
      console.log(`📡 Broadcasted new-order event for order #${order?.id} to restaurant room: ${restaurantId}`);
    }

    return order;
  }

  static async updateOrderStatusAndPayment(
    restaurantId: string,
    id: string,
    orderStatus?: OrderStatus,
    paymentStatus?: PaymentStatus
  ) {
    const orderExists = await OrderRepository.findById(restaurantId, id);
    if (!orderExists) {
      throw ApiError.notFound('Order not found');
    }

    const data: any = {};
    if (orderStatus !== undefined) data.orderStatus = orderStatus;
    if (paymentStatus !== undefined) data.paymentStatus = paymentStatus;

    const updatedOrder = await OrderRepository.updateOrder(restaurantId, id, data);

    // Emit Socket.io event for real-time Order Update
    const io = getIo();
    if (io) {
      io.to(restaurantId).emit('update-order', updatedOrder);
      console.log(`📡 Broadcasted update-order event for order #${updatedOrder.id} to restaurant room: ${restaurantId}`);
    }

    return updatedOrder;
  }
}
export default OrderService;

