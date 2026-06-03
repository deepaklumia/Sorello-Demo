import { prisma } from '../config/database';
import { Restaurant, RestaurantStatus } from '@prisma/client';

export class RestaurantRepository {
  static async findById(id: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { id },
    });
  }

  static async findBySlug(slug: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { slug },
    });
  }

  static async findByEmail(email: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { email },
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      phone?: string;
      address?: string;
      password?: string;
      status?: RestaurantStatus;
    }
  ): Promise<Restaurant> {
    return prisma.restaurant.update({
      where: { id },
      data,
    });
  }
}
export default RestaurantRepository;
