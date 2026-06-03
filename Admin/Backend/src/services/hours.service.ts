import { HoursRepository } from '../repositories/hours.repository';
import { ApiError } from '../utils/api-error';

export class HoursService {
  static async getHours(restaurantId: string) {
    return HoursRepository.findHours(restaurantId);
  }

  static async createHours(
    restaurantId: string,
    data: {
      dayOfWeek: number;
      openingTime: string;
      closingTime: string;
      isClosed?: boolean;
    }
  ) {
    const existing = await HoursRepository.findByDayOfWeek(restaurantId, data.dayOfWeek);
    if (existing) {
      throw ApiError.badRequest(`Hours configuration already exists for day ${data.dayOfWeek}`);
    }
    return HoursRepository.create(restaurantId, data);
  }

  static async updateHours(
    restaurantId: string,
    id: string,
    data: {
      dayOfWeek?: number;
      openingTime?: string;
      closingTime?: string;
      isClosed?: boolean;
    }
  ) {
    const hours = await HoursRepository.findHoursById(restaurantId, id);
    if (!hours) {
      throw ApiError.notFound('Hours configuration not found');
    }

    if (data.dayOfWeek !== undefined && data.dayOfWeek !== hours.dayOfWeek) {
      const existing = await HoursRepository.findByDayOfWeek(restaurantId, data.dayOfWeek);
      if (existing) {
        throw ApiError.badRequest(`Hours configuration already exists for day ${data.dayOfWeek}`);
      }
    }

    return HoursRepository.update(restaurantId, id, data);
  }

  static async deleteHours(restaurantId: string, id: string) {
    const hours = await HoursRepository.findHoursById(restaurantId, id);
    if (!hours) {
      throw ApiError.notFound('Hours configuration not found');
    }
    return HoursRepository.delete(restaurantId, id);
  }
}
export default HoursService;
