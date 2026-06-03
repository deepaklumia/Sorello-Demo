import { Request, Response, NextFunction } from 'express';
export declare class AnalyticsController {
    static getDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRevenue(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
}
