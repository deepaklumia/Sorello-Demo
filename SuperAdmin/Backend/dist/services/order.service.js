"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const database_1 = require("../config/database");
const api_error_1 = require("../utils/api-error");
const pagination_1 = require("../utils/pagination");
class OrderService {
    static async getAll(params) {
        const { skip, take, page, limit } = (0, pagination_1.getPaginationOptions)(params.page, params.limit);
        const where = {};
        if (params.restaurantId) {
            where.restaurantId = params.restaurantId;
        }
        if (params.orderStatus) {
            where.orderStatus = params.orderStatus;
        }
        if (params.paymentStatus) {
            where.paymentStatus = params.paymentStatus;
        }
        if (params.startDate || params.endDate) {
            where.createdAt = {};
            if (params.startDate) {
                where.createdAt.gte = new Date(params.startDate);
            }
            if (params.endDate) {
                where.createdAt.lte = new Date(params.endDate);
            }
        }
        const [orders, totalCount] = await Promise.all([
            database_1.prisma.order.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    restaurant: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
            database_1.prisma.order.count({ where }),
        ]);
        const meta = (0, pagination_1.getPaginationMeta)(page, limit, totalCount);
        return { orders, meta };
    }
    static async getById(id) {
        const order = await database_1.prisma.order.findUnique({
            where: { id },
            include: {
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                    },
                },
            },
        });
        if (!order) {
            throw api_error_1.ApiError.notFound('Order not found');
        }
        return order;
    }
}
exports.OrderService = OrderService;
