import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export function PasswordValidation() {
  return applyDecorators(
    MinLength(8, {
      message: 'password too short',
    }),
    MaxLength(24, {
      message: 'password too long',
    }),
    Matches(/(?=.*[a-z])/, {
      message: 'Password must contain at least one lowercase letter',
    }),
    Matches(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter',
    }),
    Matches(/(?=.*\d)/, {
      message: 'Password must contain at least one number',
    }),
    Matches(/(?=.*[@$!%*?&])/, {
      message: 'Password must contain at least one special character (@$!%*?&)',
    }),
    IsNotEmpty(),
  );
}
