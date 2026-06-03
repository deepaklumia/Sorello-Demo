import { OrderRepository } from '../repositories/order.repository';
import { ApiError } from '../utils/api-error';
import { OrderStatus, PaymentStatus } from '@prisma/client';

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
}
export default OrderService;
