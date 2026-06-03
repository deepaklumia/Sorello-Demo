"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoursService = void 0;
const hours_repository_1 = require("../repositories/hours.repository");
const api_error_1 = require("../utils/api-error");
class HoursService {
    static async getHours(restaurantId) {
        return hours_repository_1.HoursRepository.findHours(restaurantId);
    }
    static async createHours(restaurantId, data) {
        const existing = await hours_repository_1.HoursRepository.findByDayOfWeek(restaurantId, data.dayOfWeek);
        if (existing) {
            throw api_error_1.ApiError.badRequest(`Hours configuration already exists for day ${data.dayOfWeek}`);
        }
        return hours_repository_1.HoursRepository.create(restaurantId, data);
    }
    static async updateHours(restaurantId, id, data) {
        const hours = await hours_repository_1.HoursRepository.findHoursById(restaurantId, id);
        if (!hours) {
            throw api_error_1.ApiError.notFound('Hours configuration not found');
        }
        if (data.dayOfWeek !== undefined && data.dayOfWeek !== hours.dayOfWeek) {
            const existing = await hours_repository_1.HoursRepository.findByDayOfWeek(restaurantId, data.dayOfWeek);
            if (existing) {
                throw api_error_1.ApiError.badRequest(`Hours configuration already exists for day ${data.dayOfWeek}`);
            }
        }
        return hours_repository_1.HoursRepository.update(restaurantId, id, data);
    }
    static async deleteHours(restaurantId, id) {
        const hours = await hours_repository_1.HoursRepository.findHoursById(restaurantId, id);
        if (!hours) {
            throw api_error_1.ApiError.notFound('Hours configuration not found');
        }
        return hours_repository_1.HoursRepository.delete(restaurantId, id);
    }
}
exports.HoursService = HoursService;
exports.default = HoursService;
