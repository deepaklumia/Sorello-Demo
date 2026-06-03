import { Request, Response, NextFunction } from 'express';
export declare class OrderController {
    static getOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOrderById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default OrderController;
