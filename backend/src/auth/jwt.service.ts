import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from './type/authenticated-request.interface';

import { UserRole } from '../user/enum/user-role.enum';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  verifyToken(token: string): JwtPayload {
    try {
      const secret = this.configService.get<string>('jwt.secret');

      if (!secret) throw new UnauthorizedException('JWT token hatası');

      const payload = jwt.verify(token, secret) as JwtPayload;
      return payload;
    } catch {
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
    const secret = this.configService.get<string>('jwt.secret');
    const expiresIn = this.configService.get<string>('jwt.expiresIn');

    if (!secret) throw new Error('JWT token hatası, token oluşturulamadı');

    return jwt.sign(payload, secret, {
      expiresIn,
    } as jwt.SignOptions);
  }
}
