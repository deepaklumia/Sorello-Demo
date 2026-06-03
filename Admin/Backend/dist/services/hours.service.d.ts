export declare class HoursService {
    static getHours(restaurantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed: boolean;
    }[]>;
    static createHours(restaurantId: string, data: {
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed: boolean;
    }>;
    static updateHours(restaurantId: string, id: string, data: {
        dayOfWeek?: number;
        openingTime?: string;
        closingTime?: string;
        isClosed?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed: boolean;
    }>;
    static deleteHours(restaurantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        dayOfWeek: number;
        openingTime: string;
        closingTime: string;
        isClosed: boolean;
    }>;
}
export default HoursService;
