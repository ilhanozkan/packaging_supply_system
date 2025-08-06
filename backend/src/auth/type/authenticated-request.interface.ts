import { Request } from 'express';

import { UserRole } from '../../user/enum/user-role.enum';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
}

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
