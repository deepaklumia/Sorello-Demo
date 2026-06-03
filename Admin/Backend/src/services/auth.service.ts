import bcrypt from 'bcryptjs';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { ApiError } from '../utils/api-error';
import { JwtUtils } from '../utils/jwt';

export class AuthService {
  static async login(slug: string, email: string, passwordPlain: string) {
    const restaurant = await RestaurantRepository.findBySlug(slug);
    if (!restaurant) {
      throw ApiError.unauthorized('Invalid restaurant slug, email, or password');
    }

    if (restaurant.email !== email) {
      throw ApiError.unauthorized('Invalid restaurant slug, email, or password');
    }

    if (restaurant.status !== 'ACTIVE') {
      throw ApiError.forbidden(`Restaurant account status is ${restaurant.status.toLowerCase()}`);
    }

    const isMatch = await bcrypt.compare(passwordPlain, restaurant.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid restaurant slug, email, or password');
    }

    const token = JwtUtils.generateAccessToken({
      id: restaurant.id,
      email: restaurant.email,
      slug: restaurant.slug,
    });

    const refreshToken = JwtUtils.generateRefreshToken({
      id: restaurant.id,
      email: restaurant.email,
      slug: restaurant.slug,
    });

    return {
      token,
      refreshToken,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        email: restaurant.email,
      },
    };
  }

  static async changePassword(restaurantId: string, currentPasswordPlain: string, newPasswordPlain: string) {
    const restaurant = await RestaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw ApiError.notFound('Restaurant not found');
    }

    const isMatch = await bcrypt.compare(currentPasswordPlain, restaurant.password);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPasswordPlain, salt);

    await RestaurantRepository.update(restaurantId, { password: newPasswordHash });

    return {
      message: 'Password changed successfully',
    };
  }
}
export default AuthService;
