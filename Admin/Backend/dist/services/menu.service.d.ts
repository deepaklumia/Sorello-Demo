export declare class MenuService {
    static getCategories(restaurantId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
    }[]>;
    static createCategory(restaurantId: string, name: string, description?: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
    }>;
    static updateCategory(restaurantId: string, id: string, name?: string, description?: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
    }>;
    static deleteCategory(restaurantId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
    }>;
    static getItems(restaurantId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
        categoryId: string;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        preparationTime: number;
        isAvailable: boolean;
    }[]>;
    static getItemById(restaurantId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
        categoryId: string;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        preparationTime: number;
        isAvailable: boolean;
    }>;
    static createItem(restaurantId: string, data: {
        categoryId: string;
        name: string;
        description?: string;
        imageUrl?: string;
        price: number;
        preparationTime: number;
        isAvailable?: boolean;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
        categoryId: string;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        preparationTime: number;
        isAvailable: boolean;
    }>;
    static updateItem(restaurantId: string, id: string, data: {
        categoryId?: string;
        name?: string;
        description?: string;
        imageUrl?: string;
        price?: number;
        preparationTime?: number;
        isAvailable?: boolean;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
        categoryId: string;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        preparationTime: number;
        isAvailable: boolean;
    }>;
    static toggleAvailability(restaurantId: string, id: string, isAvailable: boolean): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
        categoryId: string;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        preparationTime: number;
        isAvailable: boolean;
    }>;
    static deleteItem(restaurantId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        description: string | null;
        categoryId: string;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        preparationTime: number;
        isAvailable: boolean;
    }>;
}
export default MenuService;
