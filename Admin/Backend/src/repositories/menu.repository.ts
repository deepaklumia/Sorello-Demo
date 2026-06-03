import { prisma } from '../config/database';
import { MenuCategory, MenuItem } from '@prisma/client';

export class MenuRepository {
  // --- Categories ---

  static async findCategories(restaurantId: string): Promise<MenuCategory[]> {
    return prisma.menuCategory.findMany({
      where: { restaurantId },
      orderBy: { name: 'asc' },
    });
  }

  static async findCategoryById(restaurantId: string, id: string): Promise<MenuCategory | null> {
    return prisma.menuCategory.findFirst({
      where: { id, restaurantId },
    });
  }

  static async createCategory(
    restaurantId: string,
    data: { name: string; description?: string }
  ): Promise<MenuCategory> {
    return prisma.menuCategory.create({
      data: {
        restaurantId,
        name: data.name,
        description: data.description,
      },
    });
  }

  static async updateCategory(
    restaurantId: string,
    id: string,
    data: { name?: string; description?: string }
  ): Promise<MenuCategory> {
    return prisma.menuCategory.update({
      where: { id }, // Primary key lookup is faster, but we also filter in service to ensure tenant isolation
      data,
    });
  }

  static async deleteCategory(restaurantId: string, id: string): Promise<MenuCategory> {
    return prisma.menuCategory.delete({
      where: { id },
    });
  }

  // --- Items ---

  static async findItems(restaurantId: string): Promise<MenuItem[]> {
    return prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: { name: 'asc' },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  static async findItemById(restaurantId: string, id: string): Promise<MenuItem | null> {
    return prisma.menuItem.findFirst({
      where: { id, restaurantId },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  static async createItem(
    restaurantId: string,
    data: {
      categoryId: string;
      name: string;
      description?: string;
      imageUrl?: string;
      price: number;
      preparationTime: number;
      isAvailable?: boolean;
    }
  ): Promise<MenuItem> {
    return prisma.menuItem.create({
      data: {
        restaurantId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
        preparationTime: data.preparationTime,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      },
    });
  }

  static async updateItem(
    restaurantId: string,
    id: string,
    data: {
      categoryId?: string;
      name?: string;
      description?: string;
      imageUrl?: string;
      price?: number;
      preparationTime?: number;
      isAvailable?: boolean;
    }
  ): Promise<MenuItem> {
    return prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  static async updateAvailability(
    restaurantId: string,
    id: string,
    isAvailable: boolean
  ): Promise<MenuItem> {
    return prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });
  }

  static async deleteItem(restaurantId: string, id: string): Promise<MenuItem> {
    return prisma.menuItem.delete({
      where: { id },
    });
  }

  static async countItems(restaurantId: string): Promise<number> {
    return prisma.menuItem.count({
      where: { restaurantId },
    });
  }
}
export default MenuRepository;
