import { prisma } from '../config/database';
import { RestaurantHours } from '@prisma/client';

export class HoursRepository {
  static async findHours(restaurantId: string): Promise<RestaurantHours[]> {
    return prisma.restaurantHours.findMany({
      where: { restaurantId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  static async findHoursById(restaurantId: string, id: string): Promise<RestaurantHours | null> {
    return prisma.restaurantHours.findFirst({
      where: { id, restaurantId },
    });
  }

  static async findByDayOfWeek(restaurantId: string, dayOfWeek: number): Promise<RestaurantHours | null> {
    return prisma.restaurantHours.findFirst({
      where: { restaurantId, dayOfWeek },
    });
  }

  static async create(
    restaurantId: string,
    data: {
      dayOfWeek: number;
      openingTime: string;
      closingTime: string;
      isClosed?: boolean;
    }
  ): Promise<RestaurantHours> {
    return prisma.restaurantHours.create({
      data: {
        restaurantId,
        dayOfWeek: data.dayOfWeek,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        isClosed: data.isClosed !== undefined ? data.isClosed : false,
      },
    });
  }

  static async update(
    restaurantId: string,
    id: string,
    data: {
      dayOfWeek?: number;
      openingTime?: string;
      closingTime?: string;
      isClosed?: boolean;
    }
  ): Promise<RestaurantHours> {
    return prisma.restaurantHours.update({
      where: { id },
      data,
    });
  }

  static async delete(restaurantId: string, id: string): Promise<RestaurantHours> {
    return prisma.restaurantHours.delete({
      where: { id },
    });
  }
}
export default HoursRepository;
