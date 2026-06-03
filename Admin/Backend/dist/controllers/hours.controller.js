"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoursController = void 0;
const hours_service_1 = require("../services/hours.service");
const api_response_1 = require("../utils/api-response");
class HoursController {
    static async getHours(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const hours = await hours_service_1.HoursService.getHours(restaurantId);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Opening hours retrieved successfully',
                data: hours,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createHours(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const hours = await hours_service_1.HoursService.createHours(restaurantId, req.body);
            (0, api_response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Opening hours created successfully',
                data: hours,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateHours(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            const updated = await hours_service_1.HoursService.updateHours(restaurantId, id, req.body);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Opening hours updated successfully',
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteHours(req, res, next) {
        try {
            const restaurantId = req.restaurant.id;
            const { id } = req.params;
            await hours_service_1.HoursService.deleteHours(restaurantId, id);
            (0, api_response_1.sendResponse)({
                res,
                message: 'Opening hours deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.HoursController = HoursController;
exports.default = HoursController;
