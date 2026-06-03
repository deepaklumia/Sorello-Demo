export declare class RestaurantService {
    static getProfile(restaurantId: string): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string;
        address: string;
        status: import(".prisma/client").$Enums.RestaurantStatus;
        subscriptionPlan: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
    }>;
    static updateProfile(restaurantId: string, data: {
        name?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string;
        address: string;
        status: import(".prisma/client").$Enums.RestaurantStatus;
        subscriptionPlan: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
    }>;
}
export default RestaurantService;
