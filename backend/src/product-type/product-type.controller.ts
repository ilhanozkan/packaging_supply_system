import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ProductTypeService } from './product-type.service';
import { ProductTypeResponseDto } from './dto/product-type-response.dto';
import { ProductTypeDto } from './dto/product-type.dto';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import { RolesGuard } from '../auth/guard/role/role.guard';

@Controller('product-types')
@UseGuards(RolesGuard)
export class ProductTypeController {
  constructor(private productTypeService: ProductTypeService) {}

  @Get()
  async listActiveProductTypes(
    @Query('search') searchName?: string,
  ): Promise<ProductTypeResponseDto[]> {
    return this.productTypeService.listActiveProductTypes(searchName);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  async listAllProductTypes(
    @Query('search') searchName?: string,
  ): Promise<ProductTypeDto[]> {
    return this.productTypeService.listAllProductTypes(searchName);
  }

  @Get(':id')
  async getProductType(
    @Param('id') id: string,
  ): Promise<ProductTypeResponseDto> {
    return this.productTypeService.getProductType(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createProductType(
    @Body() productTypeDto: CreateProductTypeDto,
  ): Promise<ProductTypeResponseDto> {
    return this.productTypeService.createProductType(productTypeDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateProductType(
    @Param('id') id: string,
    @Body() productTypeDto: UpdateProductTypeDto,
  ): Promise<ProductTypeResponseDto> {
    return this.productTypeService.updateProductType(id, productTypeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteProductType(@Param('id') id: string): Promise<void> {
    return this.productTypeService.deleteProductType(id);
  }
}
