"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const database_1 = require("../config/database");
const api_error_1 = require("../utils/api-error");
const client_1 = require("@prisma/client");
const pagination_1 = require("../utils/pagination");
class RestaurantService {
    static async getAll(params) {
        const { skip, take, page, limit } = (0, pagination_1.getPaginationOptions)(params.page, params.limit);
        const where = {
            deletedAt: null, // Exclude soft-deleted records
        };
        if (params.search) {
            where.name = {
                contains: params.search,
                mode: 'insensitive',
            };
        }
        if (params.status) {
            where.status = params.status;
        }
        const [restaurants, totalCount] = await Promise.all([
            database_1.prisma.restaurant.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            database_1.prisma.restaurant.count({ where }),
        ]);
        const meta = (0, pagination_1.getPaginationMeta)(page, limit, totalCount);
        return { restaurants, meta };
    }
    static async getById(id) {
        const restaurant = await database_1.prisma.restaurant.findUnique({
            where: { id },
        });
        if (!restaurant || restaurant.deletedAt !== null) {
            throw api_error_1.ApiError.notFound('Restaurant not found');
        }
        return restaurant;
    }
    static async create(data) {
        const existing = await database_1.prisma.restaurant.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw api_error_1.ApiError.badRequest('Restaurant email is already in use');
        }
        return database_1.prisma.restaurant.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                status: data.status || client_1.RestaurantStatus.ACTIVE,
                subscriptionPlan: data.subscriptionPlan,
            },
        });
    }
    static async update(id, data) {
        const restaurant = await this.getById(id);
        if (data.email && data.email !== restaurant.email) {
            const existing = await database_1.prisma.restaurant.findFirst({
                where: { email: data.email, id: { not: id } },
            });
            if (existing) {
                throw api_error_1.ApiError.badRequest('Restaurant email is already in use');
            }
        }
        return database_1.prisma.restaurant.update({
            where: { id },
            data,
        });
    }
    static async updateStatus(id, status) {
        await this.getById(id);
        return database_1.prisma.restaurant.update({
            where: { id },
            data: { status },
        });
    }
    static async softDelete(id) {
        await this.getById(id);
        return database_1.prisma.restaurant.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
exports.RestaurantService = RestaurantService;
