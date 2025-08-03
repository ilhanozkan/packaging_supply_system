import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { ValidationPipe } from '../shared/validation.pipe';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: LoginDto): Promise<UserResponseDto> {
    return this.authService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(data);
  }
}
