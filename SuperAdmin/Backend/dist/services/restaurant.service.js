"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const database_1 = require("../config/database");
const api_error_1 = require("../utils/api-error");
const client_1 = require("@prisma/client");
const pagination_1 = require("../utils/pagination");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
        const safeRestaurants = restaurants.map((r) => {
            const { password, ...rest } = r;
            return rest;
        });
        return { restaurants: safeRestaurants, meta };
    }
    static async getById(id) {
        const restaurant = await database_1.prisma.restaurant.findUnique({
            where: { id },
        });
        if (!restaurant || restaurant.deletedAt !== null) {
            throw api_error_1.ApiError.notFound('Restaurant not found');
        }
        const { password, ...rest } = restaurant;
        return rest;
    }
    static async create(data) {
        const existing = await database_1.prisma.restaurant.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw api_error_1.ApiError.badRequest('Restaurant email is already in use');
        }
        // Slug generation
        const slugify = (text) => {
            return text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        };
        let slug = data.slug ? slugify(data.slug) : slugify(data.name);
        if (!slug) {
            slug = 'restaurant';
        }
        if (data.slug) {
            const existingSlug = await database_1.prisma.restaurant.findUnique({
                where: { slug },
            });
            if (existingSlug) {
                throw api_error_1.ApiError.badRequest('Provided slug is already in use');
            }
        }
        else {
            let existingSlug = await database_1.prisma.restaurant.findUnique({
                where: { slug },
            });
            let counter = 1;
            const baseSlug = slug;
            while (existingSlug) {
                slug = `${baseSlug}-${counter}`;
                existingSlug = await database_1.prisma.restaurant.findUnique({
                    where: { slug },
                });
                counter++;
            }
        }
        // Password generation
        const tempPassword = data.password || `temp_${Math.random().toString(36).substring(2, 10)}`;
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(tempPassword, salt);
        const restaurant = await database_1.prisma.restaurant.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                status: data.status || client_1.RestaurantStatus.ACTIVE,
                subscriptionPlan: data.subscriptionPlan,
                slug,
                password: passwordHash,
            },
        });
        const { password, ...rest } = restaurant;
        return {
            ...rest,
            tempPassword,
        };
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
        const updated = await database_1.prisma.restaurant.update({
            where: { id },
            data,
        });
        const { password, ...rest } = updated;
        return rest;
    }
    static async updateStatus(id, status) {
        await this.getById(id);
        const updated = await database_1.prisma.restaurant.update({
            where: { id },
            data: { status },
        });
        const { password, ...rest } = updated;
        return rest;
    }
    static async softDelete(id) {
        await this.getById(id);
        const updated = await database_1.prisma.restaurant.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        const { password, ...rest } = updated;
        return rest;
    }
}
exports.RestaurantService = RestaurantService;
