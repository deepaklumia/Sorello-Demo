"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoursRepository = void 0;
const database_1 = require("../config/database");
class HoursRepository {
    static async findHours(restaurantId) {
        return database_1.prisma.restaurantHours.findMany({
            where: { restaurantId },
            orderBy: { dayOfWeek: 'asc' },
        });
    }
    static async findHoursById(restaurantId, id) {
        return database_1.prisma.restaurantHours.findFirst({
            where: { id, restaurantId },
        });
    }
    static async findByDayOfWeek(restaurantId, dayOfWeek) {
        return database_1.prisma.restaurantHours.findFirst({
            where: { restaurantId, dayOfWeek },
        });
    }
    static async create(restaurantId, data) {
        return database_1.prisma.restaurantHours.create({
            data: {
                restaurantId,
                dayOfWeek: data.dayOfWeek,
                openingTime: data.openingTime,
                closingTime: data.closingTime,
                isClosed: data.isClosed !== undefined ? data.isClosed : false,
            },
        });
    }
    static async update(restaurantId, id, data) {
        return database_1.prisma.restaurantHours.update({
            where: { id },
            data,
        });
    }
    static async delete(restaurantId, id) {
        return database_1.prisma.restaurantHours.delete({
            where: { id },
        });
    }
}
exports.HoursRepository = HoursRepository;
exports.default = HoursRepository;
