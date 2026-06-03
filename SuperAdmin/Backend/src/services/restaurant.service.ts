import { prisma } from '../config/database';
import { ApiError } from '../utils/api-error';
import { RestaurantStatus } from '@prisma/client';
import { getPaginationMeta, getPaginationOptions } from '../utils/pagination';
import bcrypt from 'bcryptjs';

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

    const safeRestaurants = restaurants.map((r) => {
      const { password, ...rest } = r;
      return rest;
    });

    return { restaurants: safeRestaurants, meta };
  }

  static async getById(id: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant || restaurant.deletedAt !== null) {
      throw ApiError.notFound('Restaurant not found');
    }

    const { password, ...rest } = restaurant;
    return rest;
  }

  static async create(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    status?: RestaurantStatus;
    subscriptionPlan: string;
    slug?: string;
    password?: string;
  }) {
    const existing = await prisma.restaurant.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw ApiError.badRequest('Restaurant email is already in use');
    }

    // Slug generation
    const slugify = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    };

    let slug = data.slug ? slugify(data.slug) : slugify(data.name);
    if (!slug) {
      slug = 'restaurant';
    }

    if (data.slug) {
      const existingSlug = await prisma.restaurant.findUnique({
        where: { slug },
      });
      if (existingSlug) {
        throw ApiError.badRequest('Provided slug is already in use');
      }
    } else {
      let existingSlug = await prisma.restaurant.findUnique({
        where: { slug },
      });
      let counter = 1;
      const baseSlug = slug;
      while (existingSlug) {
        slug = `${baseSlug}-${counter}`;
        existingSlug = await prisma.restaurant.findUnique({
          where: { slug },
        });
        counter++;
      }
    }

    // Password generation
    const tempPassword = data.password || `temp_${Math.random().toString(36).substring(2, 10)}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status || RestaurantStatus.ACTIVE,
        subscriptionPlan: data.subscriptionPlan,
        slug,
        password: passwordHash,
      },
    });

    const { password, ...rest } = restaurant;

    return {
      ...rest,
      tempPassword,
    };
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

    const updated = await prisma.restaurant.update({
      where: { id },
      data,
    });

    const { password, ...rest } = updated;
    return rest;
  }

  static async updateStatus(id: string, status: RestaurantStatus) {
    await this.getById(id);

    const updated = await prisma.restaurant.update({
      where: { id },
      data: { status },
    });

    const { password, ...rest } = updated;
    return rest;
  }

  static async softDelete(id: string) {
    await this.getById(id);

    const updated = await prisma.restaurant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    const { password, ...rest } = updated;
    return rest;
  }
}
