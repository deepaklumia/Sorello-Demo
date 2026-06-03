import { prisma } from '../config/database';
import { Order, OrderStatus, PaymentStatus } from '@prisma/client';

export class OrderRepository {
  static async findOrders(
    restaurantId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      orderStatus?: OrderStatus;
      paymentStatus?: PaymentStatus;
      skip: number;
      take: number;
    }
  ): Promise<[Order[], number]> {
    const where: any = {
      restaurantId,
    };

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (filters.orderStatus) {
      where.orderStatus = filters.orderStatus;
    }

    if (filters.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    const [orders, count] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
        skip: filters.skip,
        take: filters.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return [orders as any, count];
  }

  static async findById(restaurantId: string, id: string): Promise<any | null> {
    return prisma.order.findFirst({
      where: { id, restaurantId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  static async createOrder(
    restaurantId: string,
    customerName: string,
    totalAmount: number,
    cartItems: { menuItemId: string; quantity: number; price: number; customizations?: string | null }[],
    cartId: string
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          restaurantId,
          customerName,
          totalAmount,
          orderStatus: 'PENDING',
          paymentStatus: 'PENDING',
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price,
          customizations: item.customizations || null,
        })),
      });

      await tx.cart.delete({
        where: { id: cartId },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    });
  }

  static async updateOrder(
    restaurantId: string,
    id: string,
    data: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus }
  ) {
    return prisma.order.update({
      where: { id, restaurantId },
      data,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }


  static async aggregateStats(restaurantId: string) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);
    startOfThisMonth.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, todayOrdersList, monthlyOrdersList] = await Promise.all([
      prisma.order.count({ where: { restaurantId } }),
      prisma.order.count({
        where: {
          restaurantId,
          createdAt: { gte: startOfToday },
        },
      }),
      prisma.order.findMany({
        where: {
          restaurantId,
          createdAt: { gte: startOfToday },
          orderStatus: OrderStatus.COMPLETED,
        },
        select: { totalAmount: true },
      }),
      prisma.order.findMany({
        where: {
          restaurantId,
          createdAt: { gte: startOfThisMonth },
          orderStatus: OrderStatus.COMPLETED,
        },
        select: { totalAmount: true },
      }),
    ]);

    const todayRevenue = todayOrdersList.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    const monthlyRevenue = monthlyOrdersList.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

    return {
      totalOrders,
      todayOrders,
      todayRevenue,
      monthlyRevenue,
    };
  }
}
export default OrderRepository;
