import { RestaurantStatus } from '@prisma/client';
export declare class RestaurantService {
    static getAll(params: {
        page?: unknown;
        limit?: unknown;
        search?: string;
        status?: RestaurantStatus;
    }): Promise<{
        restaurants: {
            status: import(".prisma/client").$Enums.RestaurantStatus;
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            address: string;
            subscriptionPlan: string;
            deletedAt: Date | null;
        }[];
        meta: import("../utils/pagination").PaginationMeta;
    }>;
    static getById(id: string): Promise<{
        status: import(".prisma/client").$Enums.RestaurantStatus;
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        address: string;
        subscriptionPlan: string;
        deletedAt: Date | null;
    }>;
    static create(data: {
        name: string;
        email: string;
        phone: string;
        address: string;
        status?: RestaurantStatus;
        subscriptionPlan: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.RestaurantStatus;
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        address: string;
        subscriptionPlan: string;
        deletedAt: Date | null;
    }>;
    static update(id: string, data: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        subscriptionPlan?: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.RestaurantStatus;
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        address: string;
        subscriptionPlan: string;
        deletedAt: Date | null;
    }>;
    static updateStatus(id: string, status: RestaurantStatus): Promise<{
        status: import(".prisma/client").$Enums.RestaurantStatus;
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        address: string;
        subscriptionPlan: string;
        deletedAt: Date | null;
    }>;
    static softDelete(id: string): Promise<{
        status: import(".prisma/client").$Enums.RestaurantStatus;
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        address: string;
        subscriptionPlan: string;
        deletedAt: Date | null;
    }>;
}
