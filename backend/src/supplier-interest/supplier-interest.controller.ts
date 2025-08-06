import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { SupplierInterestService } from './supplier-interest.service';
import { SupplierInterestResponseDto } from './dto/supplier-interest-response.dto';
import { CreateSupplierInterestDto } from './dto/create-supplier-interest.dto';
import { UpdateSupplierInterestDto } from './dto/update-supplier-interest.dto';

import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import { RolesGuard } from '../auth/guard/role/role.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import type { RequestWithUser } from '../shared/type/user';

@Controller('supplier-interests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierInterestController {
  constructor(
    private readonly supplierInterestService: SupplierInterestService,
  ) {}

  @Post()
  @Roles(UserRole.SUPPLIER)
  async create(
    @Req() req: RequestWithUser,
    @Body() createSupplierInterestDto: CreateSupplierInterestDto,
  ): Promise<SupplierInterestResponseDto> {
    const supplierId = req.user.id;
    return this.supplierInterestService.create(
      supplierId,
      createSupplierInterestDto,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<SupplierInterestResponseDto[]> {
    return this.supplierInterestService.findAll();
  }

  @Get('my-interests')
  @Roles(UserRole.SUPPLIER)
  async findMyInterests(
    @Req() req: RequestWithUser,
  ): Promise<SupplierInterestResponseDto[]> {
    const supplierId = req.user.id;
    return this.supplierInterestService.findBySupplier(supplierId);
  }

  @Get('order-request/:orderRequestId')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  async findByOrderRequest(
    @Param('orderRequestId') orderRequestId: string,
  ): Promise<SupplierInterestResponseDto[]> {
    return this.supplierInterestService.findByOrderRequest(orderRequestId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER, UserRole.CUSTOMER)
  async findOne(@Param('id') id: string): Promise<SupplierInterestResponseDto> {
    return this.supplierInterestService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPPLIER)
  async update(
    @Param('id') id: string,
    @Body() updateSupplierInterestDto: UpdateSupplierInterestDto,
  ): Promise<SupplierInterestResponseDto> {
    return this.supplierInterestService.update(id, updateSupplierInterestDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  async remove(@Param('id') id: string): Promise<void> {
    return this.supplierInterestService.remove(id);
  }
}
