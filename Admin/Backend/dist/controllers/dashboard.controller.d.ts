import { Request, Response, NextFunction } from 'express';
export declare class DashboardController {
    static getOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default DashboardController;
