"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const menu_service_1 = require("../services/menu.service");
const api_response_1 = require("../utils/api-response");
class MenuController {
    // --- Categories ---
    static async getCategories(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const categories = await menu_service_1.MenuService.getCategories(restaurantId);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Menu categories retrieved successfully',
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createCategory(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { name, description } = req.body;
            const category = await menu_service_1.MenuService.createCategory(restaurantId, name, description);
            (0, api_response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Menu category created successfully',
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCategory(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            const { name, description } = req.body;
            const updated = await menu_service_1.MenuService.updateCategory(restaurantId, id, name, description);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Menu category updated successfully',
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteCategory(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            await menu_service_1.MenuService.deleteCategory(restaurantId, id);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Menu category deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    // --- Items ---
    static async getItems(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const items = await menu_service_1.MenuService.getItems(restaurantId);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Menu items retrieved successfully',
                data: items,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getItemById(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            const item = await menu_service_1.MenuService.getItemById(restaurantId, id);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Menu item retrieved successfully',
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createItem(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const item = await menu_service_1.MenuService.createItem(restaurantId, req.body);
            (0, api_response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Menu item created successfully',
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateItem(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            const updated = await menu_service_1.MenuService.updateItem(restaurantId, id, req.body);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Menu item updated successfully',
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async patchAvailability(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            const { isAvailable } = req.body;
            const updated = await menu_service_1.MenuService.toggleAvailability(restaurantId, id, isAvailable);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Menu item availability status updated',
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteItem(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            await menu_service_1.MenuService.deleteItem(restaurantId, id);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Menu item deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MenuController = MenuController;
exports.default = MenuController;
