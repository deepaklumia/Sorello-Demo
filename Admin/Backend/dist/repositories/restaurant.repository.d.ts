import { Restaurant, RestaurantStatus } from '@prisma/client';
export declare class RestaurantRepository {
    static findById(id: string): Promise<Restaurant | null>;
    static findBySlug(slug: string): Promise<Restaurant | null>;
    static findByEmail(email: string): Promise<Restaurant | null>;
    static update(id: string, data: {
        name?: string;
        phone?: string;
        address?: string;
        password?: string;
        status?: RestaurantStatus;
    }): Promise<Restaurant>;
}
export default RestaurantRepository;
