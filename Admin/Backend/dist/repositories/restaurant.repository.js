"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantRepository = void 0;
const database_1 = require("../config/database");
class RestaurantRepository {
    static async findById(id) {
        return database_1.prisma.restaurant.findUnique({
            where: { id },
        });
    }
    static async findBySlug(slug) {
        return database_1.prisma.restaurant.findUnique({
            where: { slug },
        });
    }
    static async findByEmail(email) {
        return database_1.prisma.restaurant.findUnique({
            where: { email },
        });
    }
    static async update(id, data) {
        return database_1.prisma.restaurant.update({
            where: { id },
            data,
        });
    }
}
exports.RestaurantRepository = RestaurantRepository;
exports.default = RestaurantRepository;
