import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import { UserRole } from './enum/user-role.enum';

import { Roles } from '../auth/decorator/roles.decorator';
import { ProductTypeDto } from '../product-type/dto/product-type.dto';
import { ProductTypeService } from '../product-type/product-type.service';
import { RolesGuard } from '../auth/guard/role/role.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private userService: UserService,
    private productTypeService: ProductTypeService,
  ) {}

  @Get('users')
  listAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<UserResponseDto[]> {
    return this.userService.listAllUsers({ page, limit });
  }

  @Get('product-types')
  listAllProductTypes(
    @Query('search') searchName?: string,
  ): Promise<ProductTypeDto[]> {
    return this.productTypeService.listAllProductTypes(searchName);
  }
}
