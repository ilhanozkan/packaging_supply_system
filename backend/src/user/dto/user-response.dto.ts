import { UserRole } from '../enum/user-role.enum';

export class UserResponseDto {
  id: string;

  email: string;

  firstName: string;

  lastName: string;

  companyName?: string;

  role: UserRole;

  token?: string;
}
