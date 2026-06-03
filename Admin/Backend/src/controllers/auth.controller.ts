import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/api-response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug, email, password } = req.body;
      const result = await AuthService.login(slug, email, password);
      sendResponse({
        res,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.restaurant!.id;
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(restaurantId, currentPassword, newPassword);
      sendResponse({
        res,
        message: 'Password changed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default AuthController;
