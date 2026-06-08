import { prisma } from '../config/database';
import { ApiError } from '../utils/api-error';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { getPaginationMeta, getPaginationOptions } from '../utils/pagination';

export class OrderService {
  static async getAll(params: {
    page?: unknown;
    limit?: unknown;
    restaurantId?: string;
    startDate?: string;
    endDate?: string;
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
  }) {
    const { skip, take, page, limit } = getPaginationOptions(params.page, params.limit);

    const where: any = {};

    if (params.restaurantId) {
      where.restaurantId = params.restaurantId;
    }

    if (params.orderStatus) {
      where.orderStatus = params.orderStatus;
    }

    if (params.paymentStatus) {
      where.paymentStatus = params.paymentStatus;
    }

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.createdAt.lte = new Date(params.endDate);
      }
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
            },
          },
          items: {
            include: {
              menuItem: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const meta = getPaginationMeta(page, limit, totalCount);

    return { orders, meta };
  }

  static async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }
}
