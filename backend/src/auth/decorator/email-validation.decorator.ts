import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export function EmailValidation() {
  return applyDecorators(IsEmail(), IsNotEmpty(), MaxLength(255));
}
