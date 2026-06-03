import { RestaurantRepository } from '../repositories/restaurant.repository';
import { ApiError } from '../utils/api-error';

export class RestaurantService {
  static async getProfile(restaurantId: string) {
    const restaurant = await RestaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw ApiError.notFound('Restaurant not found');
    }

    const { password, ...safeRestaurant } = restaurant;
    return safeRestaurant;
  }

  static async updateProfile(
    restaurantId: string,
    data: {
      name?: string;
      phone?: string;
      address?: string;
    }
  ) {
    const updated = await RestaurantRepository.update(restaurantId, data);
    const { password, ...safeRestaurant } = updated;
    return safeRestaurant;
  }
}
export default RestaurantService;
