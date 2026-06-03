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
            slug: string;
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
        slug: string;
    }>;
    static create(data: {
        name: string;
        email: string;
        phone: string;
        address: string;
        status?: RestaurantStatus;
        subscriptionPlan: string;
        slug?: string;
        password?: string;
    }): Promise<{
        tempPassword: string;
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
        slug: string;
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
        slug: string;
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
        slug: string;
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
        slug: string;
    }>;
}
