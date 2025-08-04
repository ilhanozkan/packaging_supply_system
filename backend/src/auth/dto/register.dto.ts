import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { EmailValidation } from '../decorator/email-validation.decorator';
import { Match } from '../decorator/match.decorator';
import { PasswordValidation } from '../decorator/password-validation.decorator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @EmailValidation()
  email: string;

  @PasswordValidation()
  password: string;

  @Match('password', {
    message: 'Password cofirmation does not match password',
  })
  passwordConfirmation: string;

  @IsOptional()
  isSupplier?: boolean;
}
