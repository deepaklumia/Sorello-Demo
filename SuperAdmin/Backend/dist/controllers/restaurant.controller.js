"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const restaurant_service_1 = require("../services/restaurant.service");
const api_response_1 = require("../utils/api-response");
class RestaurantController {
    static async list(req, res, next) {
        try {
            const { page, limit, search, status } = req.query;
            const { restaurants, meta } = await restaurant_service_1.RestaurantService.getAll({
                page,
                limit,
                search,
                status,
            });
            (0, api_response_1.sendResponse)({
                res,
                message: 'Restaurants retrieved successfully',
                data: restaurants,
                meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async detail(req, res, next) {
        try {
            const { id } = req.params;
            const restaurant = await restaurant_service_1.RestaurantService.getById(id);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Restaurant retrieved successfully',
                data: restaurant,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const restaurant = await restaurant_service_1.RestaurantService.create(req.body);
            (0, api_response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Restaurant created successfully',
                data: restaurant,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const restaurant = await restaurant_service_1.RestaurantService.update(id, req.body);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Restaurant updated successfully',
                data: restaurant,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const restaurant = await restaurant_service_1.RestaurantService.updateStatus(id, status);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Restaurant status updated successfully',
                data: restaurant,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async softDelete(req, res, next) {
        try {
            const { id } = req.params;
            await restaurant_service_1.RestaurantService.softDelete(id);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Restaurant deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RestaurantController = RestaurantController;
