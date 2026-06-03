import { Request, Response, NextFunction } from 'express';
export declare class MenuController {
    static getCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getItems(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getItemById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    static patchAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteItem(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default MenuController;
