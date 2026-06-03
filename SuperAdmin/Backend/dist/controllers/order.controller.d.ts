import { Request, Response, NextFunction } from 'express';
export declare class OrderController {
    static list(req: Request, res: Response, next: NextFunction): Promise<void>;
    static detail(req: Request, res: Response, next: NextFunction): Promise<void>;
}
