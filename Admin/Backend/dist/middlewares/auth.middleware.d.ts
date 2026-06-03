import { Request, Response, NextFunction } from 'express';
import { Restaurant } from '@prisma/client';
declare global {
    namespace Express {
        interface Request {
            restaurant?: Restaurant;
        }
    }
}
export declare const authenticateRestaurant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default authenticateRestaurant;
