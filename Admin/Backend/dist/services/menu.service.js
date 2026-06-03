"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const menu_repository_1 = require("../repositories/menu.repository");
const api_error_1 = require("../utils/api-error");
class MenuService {
    // --- Categories ---
    static async getCategories(restaurantId) {
        return menu_repository_1.MenuRepository.findCategories(restaurantId);
    }
    static async createCategory(restaurantId, name, description) {
        return menu_repository_1.MenuRepository.createCategory(restaurantId, { name, description });
    }
    static async updateCategory(restaurantId, id, name, description) {
        const category = await menu_repository_1.MenuRepository.findCategoryById(restaurantId, id);
        if (!category) {
            throw api_error_1.ApiError.notFound('Menu category not found');
        }
        return menu_repository_1.MenuRepository.updateCategory(restaurantId, id, { name, description });
    }
    static async deleteCategory(restaurantId, id) {
        const category = await menu_repository_1.MenuRepository.findCategoryById(restaurantId, id);
        if (!category) {
            throw api_error_1.ApiError.notFound('Menu category not found');
        }
        return menu_repository_1.MenuRepository.deleteCategory(restaurantId, id);
    }
    // --- Items ---
    static async getItems(restaurantId) {
        return menu_repository_1.MenuRepository.findItems(restaurantId);
    }
    static async getItemById(restaurantId, id) {
        const item = await menu_repository_1.MenuRepository.findItemById(restaurantId, id);
        if (!item) {
            throw api_error_1.ApiError.notFound('Menu item not found');
        }
        return item;
    }
    static async createItem(restaurantId, data) {
        const category = await menu_repository_1.MenuRepository.findCategoryById(restaurantId, data.categoryId);
        if (!category) {
            throw api_error_1.ApiError.badRequest('Invalid category ID provided');
        }
        return menu_repository_1.MenuRepository.createItem(restaurantId, data);
    }
    static async updateItem(restaurantId, id, data) {
        const item = await menu_repository_1.MenuRepository.findItemById(restaurantId, id);
        if (!item) {
            throw api_error_1.ApiError.notFound('Menu item not found');
        }
        if (data.categoryId) {
            const category = await menu_repository_1.MenuRepository.findCategoryById(restaurantId, data.categoryId);
            if (!category) {
                throw api_error_1.ApiError.badRequest('Invalid category ID provided');
            }
        }
        return menu_repository_1.MenuRepository.updateItem(restaurantId, id, data);
    }
    static async toggleAvailability(restaurantId, id, isAvailable) {
        const item = await menu_repository_1.MenuRepository.findItemById(restaurantId, id);
        if (!item) {
            throw api_error_1.ApiError.notFound('Menu item not found');
        }
        return menu_repository_1.MenuRepository.updateAvailability(restaurantId, id, isAvailable);
    }
    static async deleteItem(restaurantId, id) {
        const item = await menu_repository_1.MenuRepository.findItemById(restaurantId, id);
        if (!item) {
            throw api_error_1.ApiError.notFound('Menu item not found');
        }
        return menu_repository_1.MenuRepository.deleteItem(restaurantId, id);
    }
}
exports.MenuService = MenuService;
exports.default = MenuService;
