import { Request, Response, NextFunction } from 'express';
export declare class RestaurantController {
    static list(req: Request, res: Response, next: NextFunction): Promise<void>;
    static detail(req: Request, res: Response, next: NextFunction): Promise<void>;
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static softDelete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
