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
  Query,
} from '@nestjs/common';

import { OrderRequestService } from './order-request.service';
import { OrderRequestResponseDto } from './dto/order-request-response.dto';
import { RequestStatus } from './enum/request-status.enum';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { UpdateOrderRequestDto } from './dto/update-order-request.dto';

import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import { RolesGuard } from '../auth/guard/role/role.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('order-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderRequestController {
  constructor(private readonly orderRequestService: OrderRequestService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  async create(
    @Req() req: any,
    @Body() createOrderRequestDto: CreateOrderRequestDto,
  ): Promise<OrderRequestResponseDto> {
    const customerId = req.user.id;
    return this.orderRequestService.create(customerId, createOrderRequestDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  async findAll(
    @Query('productTypeIds') productTypeIds?: string,
  ): Promise<OrderRequestResponseDto[]> {
    const productTypeIdArray = productTypeIds
      ? productTypeIds
          .split(',')
          .map(id => id.trim())
          .filter(id => id)
      : undefined;

    return this.orderRequestService.findAll(productTypeIdArray);
  }

  @Get('my-orders')
  @Roles(UserRole.CUSTOMER)
  async findMyOrders(@Req() req: any): Promise<OrderRequestResponseDto[]> {
    const customerId = req.user.id;
    return this.orderRequestService.findByCustomer(customerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SUPPLIER)
  async findOne(@Param('id') id: string): Promise<OrderRequestResponseDto> {
    return this.orderRequestService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateOrderRequestDto: UpdateOrderRequestDto,
  ): Promise<OrderRequestResponseDto> {
    return this.orderRequestService.update(id, updateOrderRequestDto);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: RequestStatus,
  ): Promise<OrderRequestResponseDto> {
    return this.orderRequestService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  async remove(@Param('id') id: string): Promise<void> {
    return this.orderRequestService.remove(id);
  }
}
