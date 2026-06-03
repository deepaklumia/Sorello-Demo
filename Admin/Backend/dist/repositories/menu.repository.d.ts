import { MenuCategory, MenuItem } from '@prisma/client';
export declare class MenuRepository {
    static findCategories(restaurantId: string): Promise<MenuCategory[]>;
    static findCategoryById(restaurantId: string, id: string): Promise<MenuCategory | null>;
    static createCategory(restaurantId: string, data: {
        name: string;
        description?: string;
    }): Promise<MenuCategory>;
    static updateCategory(restaurantId: string, id: string, data: {
        name?: string;
        description?: string;
    }): Promise<MenuCategory>;
    static deleteCategory(restaurantId: string, id: string): Promise<MenuCategory>;
    static findItems(restaurantId: string): Promise<MenuItem[]>;
    static findItemById(restaurantId: string, id: string): Promise<MenuItem | null>;
    static createItem(restaurantId: string, data: {
        categoryId: string;
        name: string;
        description?: string;
        imageUrl?: string;
        price: number;
        preparationTime: number;
        isAvailable?: boolean;
    }): Promise<MenuItem>;
    static updateItem(restaurantId: string, id: string, data: {
        categoryId?: string;
        name?: string;
        description?: string;
        imageUrl?: string;
        price?: number;
        preparationTime?: number;
        isAvailable?: boolean;
    }): Promise<MenuItem>;
    static updateAvailability(restaurantId: string, id: string, isAvailable: boolean): Promise<MenuItem>;
    static deleteItem(restaurantId: string, id: string): Promise<MenuItem>;
    static countItems(restaurantId: string): Promise<number>;
}
export default MenuRepository;
