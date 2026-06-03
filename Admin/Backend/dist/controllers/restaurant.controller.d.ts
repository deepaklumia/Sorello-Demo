import { Request, Response, NextFunction } from 'express';
export declare class RestaurantController {
    static getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default RestaurantController;
