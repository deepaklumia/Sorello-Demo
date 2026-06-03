import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { ApiError } from '../utils/api-error';
import { UserRole } from '@prisma/client';

export class AuthService {
  static async register(data: {
    email: string;
    passwordPlain: string;
    name: string;
    role: UserRole;
    restaurantId?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw ApiError.badRequest('Email is already registered');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.passwordPlain, salt);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hash,
        name: data.name,
        role: data.role,
        restaurantId: data.restaurantId || null,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      restaurantId: user.restaurantId,
    };
  }

  static async login(email: string, passwordPlain: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    };
  }
}
