import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import type { AuthenticatedRequest } from './type/authenticated-request.interface';

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: AuthenticatedRequest): {
    user: AuthenticatedRequest['user'];
    message: string;
  } {
    return {
      user: req.user,
      message: 'Authentication successful',
    };
  }
}
