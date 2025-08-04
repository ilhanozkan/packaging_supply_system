import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { UserRole } from '../user/enum/user-role.enum';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  verifyToken(token: string): JwtPayload {
    try {
      const secret = process.env.JWT_SECRET;

      if (!secret) throw new UnauthorizedException('JWT secret not configured');

      const payload = jwt.verify(token, secret) as JwtPayload;
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  generateToken(payload: {
    id: string;
    email: string;
    role: UserRole;
  }): string {
    const secret = process.env.JWT_SECRET;

    if (!secret)
      throw new Error('JWT_SECRET is not defined in environment variables');

    return jwt.sign(payload, secret, {
      expiresIn: '7d',
    });
  }
}
