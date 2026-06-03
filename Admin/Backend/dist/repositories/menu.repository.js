"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuRepository = void 0;
const database_1 = require("../config/database");
class MenuRepository {
    // --- Categories ---
    static async findCategories(restaurantId) {
        return database_1.prisma.menuCategory.findMany({
            where: { restaurantId },
            orderBy: { name: 'asc' },
        });
    }
    static async findCategoryById(restaurantId, id) {
        return database_1.prisma.menuCategory.findFirst({
            where: { id, restaurantId },
        });
    }
    static async createCategory(restaurantId, data) {
        return database_1.prisma.menuCategory.create({
            data: {
                restaurantId,
                name: data.name,
                description: data.description,
            },
        });
    }
    static async updateCategory(restaurantId, id, data) {
        return database_1.prisma.menuCategory.update({
            where: { id }, // Primary key lookup is faster, but we also filter in service to ensure tenant isolation
            data,
        });
    }
    static async deleteCategory(restaurantId, id) {
        return database_1.prisma.menuCategory.delete({
            where: { id },
        });
    }
    // --- Items ---
    static async findItems(restaurantId) {
        return database_1.prisma.menuItem.findMany({
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
    static async findItemById(restaurantId, id) {
        return database_1.prisma.menuItem.findFirst({
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
    static async createItem(restaurantId, data) {
        return database_1.prisma.menuItem.create({
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
    static async updateItem(restaurantId, id, data) {
        return database_1.prisma.menuItem.update({
            where: { id },
            data,
        });
    }
    static async updateAvailability(restaurantId, id, isAvailable) {
        return database_1.prisma.menuItem.update({
            where: { id },
            data: { isAvailable },
        });
    }
    static async deleteItem(restaurantId, id) {
        return database_1.prisma.menuItem.delete({
            where: { id },
        });
    }
    static async countItems(restaurantId) {
        return database_1.prisma.menuItem.count({
            where: { restaurantId },
        });
    }
}
exports.MenuRepository = MenuRepository;
exports.default = MenuRepository;
