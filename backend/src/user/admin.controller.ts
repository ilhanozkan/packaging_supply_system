import { Controller, Get, Query } from '@nestjs/common';

import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import { UserRole } from './enum/user-role.enum';

import { Roles } from '../auth/decorator/roles.decorator';

@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private userService: UserService) {}

  @Get('users')
  listAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<UserResponseDto[]> {
    return this.userService.listAllUsers({ page, limit });
  }
}
