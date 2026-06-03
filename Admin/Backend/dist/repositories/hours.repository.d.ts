import { RestaurantHours } from '@prisma/client';
export declare class HoursRepository {
    static findHours(restaurantId: string): Promise<RestaurantHours[]>;
    static findHoursById(restaurantId: string, id: string): Promise<RestaurantHours | null>;
    static findByDayOfWeek(restaurantId: string, dayOfWeek: number): Promise<RestaurantHours | null>;
    static create(restaurantId: string, data: {
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed?: boolean;
    }): Promise<RestaurantHours>;
    static update(restaurantId: string, id: string, data: {
        dayOfWeek?: number;
        openingTime?: string;
        closingTime?: string;
        isClosed?: boolean;
    }): Promise<RestaurantHours>;
    static delete(restaurantId: string, id: string): Promise<RestaurantHours>;
}
export default HoursRepository;
