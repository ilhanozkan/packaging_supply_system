import { EmailValidation } from '../decorator/email-validation.decorator';
import { PasswordValidation } from '../decorator/password-validation.decorator';

export class LoginDto {
  @EmailValidation()
  email: string;

  @PasswordValidation()
  password: string;
}
