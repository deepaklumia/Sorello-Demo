import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt';
import { ApiError } from '../utils/api-error';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { Restaurant } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      restaurant?: Restaurant;
    }
  }
}

export const authenticateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = JwtUtils.verifyToken(token);
    } catch (err) {
      throw ApiError.unauthorized('Invalid or expired authentication token');
    }

    const restaurant = await RestaurantRepository.findById(payload.id);
    if (!restaurant) {
      throw ApiError.unauthorized('Restaurant not found');
    }

    if (restaurant.status !== 'ACTIVE') {
      throw ApiError.forbidden(`Restaurant account is ${restaurant.status.toLowerCase()}`);
    }

    if (restaurant.slug !== payload.slug) {
      throw ApiError.unauthorized('Invalid token mapping');
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    next(error);
  }
};
export default authenticateRestaurant;
