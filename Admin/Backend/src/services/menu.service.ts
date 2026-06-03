import { MenuRepository } from '../repositories/menu.repository';
import { ApiError } from '../utils/api-error';

export class MenuService {
  // --- Categories ---

  static async getCategories(restaurantId: string) {
    return MenuRepository.findCategories(restaurantId);
  }

  static async createCategory(restaurantId: string, name: string, description?: string) {
    return MenuRepository.createCategory(restaurantId, { name, description });
  }

  static async updateCategory(restaurantId: string, id: string, name?: string, description?: string) {
    const category = await MenuRepository.findCategoryById(restaurantId, id);
    if (!category) {
      throw ApiError.notFound('Menu category not found');
    }
    return MenuRepository.updateCategory(restaurantId, id, { name, description });
  }

  static async deleteCategory(restaurantId: string, id: string) {
    const category = await MenuRepository.findCategoryById(restaurantId, id);
    if (!category) {
      throw ApiError.notFound('Menu category not found');
    }
    return MenuRepository.deleteCategory(restaurantId, id);
  }

  // --- Items ---

  static async getItems(restaurantId: string) {
    return MenuRepository.findItems(restaurantId);
  }

  static async getItemById(restaurantId: string, id: string) {
    const item = await MenuRepository.findItemById(restaurantId, id);
    if (!item) {
      throw ApiError.notFound('Menu item not found');
    }
    return item;
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
  ) {
    const category = await MenuRepository.findCategoryById(restaurantId, data.categoryId);
    if (!category) {
      throw ApiError.badRequest('Invalid category ID provided');
    }
    return MenuRepository.createItem(restaurantId, data);
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
  ) {
    const item = await MenuRepository.findItemById(restaurantId, id);
    if (!item) {
      throw ApiError.notFound('Menu item not found');
    }

    if (data.categoryId) {
      const category = await MenuRepository.findCategoryById(restaurantId, data.categoryId);
      if (!category) {
        throw ApiError.badRequest('Invalid category ID provided');
      }
    }

    return MenuRepository.updateItem(restaurantId, id, data);
  }

  static async toggleAvailability(restaurantId: string, id: string, isAvailable: boolean) {
    const item = await MenuRepository.findItemById(restaurantId, id);
    if (!item) {
      throw ApiError.notFound('Menu item not found');
    }
    return MenuRepository.updateAvailability(restaurantId, id, isAvailable);
  }

  static async deleteItem(restaurantId: string, id: string) {
    const item = await MenuRepository.findItemById(restaurantId, id);
    if (!item) {
      throw ApiError.notFound('Menu item not found');
    }
    return MenuRepository.deleteItem(restaurantId, id);
  }
}
export default MenuService;
