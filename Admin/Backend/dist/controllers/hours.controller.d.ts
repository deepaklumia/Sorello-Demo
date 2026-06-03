import { Request, Response, NextFunction } from 'express';
export declare class HoursController {
    static getHours(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createHours(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateHours(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteHours(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default HoursController;
