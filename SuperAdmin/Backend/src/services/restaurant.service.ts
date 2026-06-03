import { prisma } from '../config/database';
import { ApiError } from '../utils/api-error';
import { RestaurantStatus } from '@prisma/client';
import { getPaginationMeta, getPaginationOptions } from '../utils/pagination';

export class RestaurantService {
  static async getAll(params: {
    page?: unknown;
    limit?: unknown;
    search?: string;
    status?: RestaurantStatus;
  }) {
    const { skip, take, page, limit } = getPaginationOptions(params.page, params.limit);

    const where: any = {
      deletedAt: null, // Exclude soft-deleted records
    };

    if (params.search) {
      where.name = {
        contains: params.search,
        mode: 'insensitive',
      };
    }

    if (params.status) {
      where.status = params.status;
    }

    const [restaurants, totalCount] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.restaurant.count({ where }),
    ]);

    const meta = getPaginationMeta(page, limit, totalCount);

    return { restaurants, meta };
  }

  static async getById(id: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant || restaurant.deletedAt !== null) {
      throw ApiError.notFound('Restaurant not found');
    }

    return restaurant;
  }

  static async create(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    status?: RestaurantStatus;
    subscriptionPlan: string;
  }) {
    const existing = await prisma.restaurant.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw ApiError.badRequest('Restaurant email is already in use');
    }

    return prisma.restaurant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status || RestaurantStatus.ACTIVE,
        subscriptionPlan: data.subscriptionPlan,
      },
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      subscriptionPlan?: string;
    }
  ) {
    const restaurant = await this.getById(id);

    if (data.email && data.email !== restaurant.email) {
      const existing = await prisma.restaurant.findFirst({
        where: { email: data.email, id: { not: id } },
      });
      if (existing) {
        throw ApiError.badRequest('Restaurant email is already in use');
      }
    }

    return prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  static async updateStatus(id: string, status: RestaurantStatus) {
    await this.getById(id);

    return prisma.restaurant.update({
      where: { id },
      data: { status },
    });
  }

  static async softDelete(id: string) {
    await this.getById(id);

    return prisma.restaurant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
