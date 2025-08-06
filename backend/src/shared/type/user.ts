import { Request } from 'express';

import { JwtPayload } from '../../auth/type/authenticated-request.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
