import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  id: string;
  email: string;
  slug: string;
}

export class JwtUtils {
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    // Standard refresh token with longer duration (e.g. 7 days)
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' as any });
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }
}
export default JwtUtils;
