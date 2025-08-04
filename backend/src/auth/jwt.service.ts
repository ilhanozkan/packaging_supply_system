import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { UserRole } from '../user/enum/user-role.enum';

export interface JwtPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyName?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  verifyToken(token: string): JwtPayload {
    try {
      const secret = process.env.JWT_SECRET;

      if (!secret) throw new UnauthorizedException('JWT token hatası');

      const payload = jwt.verify(token, secret) as JwtPayload;
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Geçersiz JWT token');
    }
  }

  generateToken(payload: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    companyName?: string;
  }): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error('JWT token hatası, token oluşturulamadı');

    return jwt.sign(payload, secret, {
      expiresIn: '7d',
    });
  }
}
