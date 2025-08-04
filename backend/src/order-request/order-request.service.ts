import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderRequest } from './entity/order-request.entity';
import { OrderRequestResponseDto } from './dto/order-request-response.dto';
import { RequestStatus } from './enum/request-status.enum';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { UpdateOrderRequestDto } from './dto/update-order-request.dto';

import { User } from '../user/user.entity';
import { OrderItem } from '../order-item/entity/order-item.entity';
import { ProductType } from '../product-type/entity/product-type.entity';

@Injectable()
export class OrderRequestService {
  constructor(
    @InjectRepository(OrderRequest)
    private readonly orderRequestRepository: Repository<OrderRequest>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) {}

  async create(
    customerId: string,
    createOrderRequestDto: CreateOrderRequestDto,
  ): Promise<OrderRequestResponseDto> {
    const customer = await this.userRepository.findOne({
      where: { id: customerId },
    });

    if (!customer)
      throw new NotFoundException(`Customer with ID ${customerId} not found`);

    const orderRequest = this.orderRequestRepository.create({
      customer,
      title: createOrderRequestDto.title,
      description: createOrderRequestDto.description,
      expirationDate: createOrderRequestDto.expirationDate,
      status: RequestStatus.ACTIVE,
    });

    const savedOrderRequest =
      await this.orderRequestRepository.save(orderRequest);

    // Create OrderItems with ProductType entities
    const orderItems = await Promise.all(
      createOrderRequestDto.orderItems.map(async item => {
        // Find the ProductType entity
        const productType = await this.productTypeRepository.findOne({
          where: { id: item.productTypeId },
        });

        if (!productType)
          throw new NotFoundException(
            `ProductType with ID ${item.productTypeId} not found`,
          );

        return this.orderItemRepository.create({
          orderRequest: savedOrderRequest,
          productType,
          requestedQuantity: item.requestedQuantity,
          description: item.description,
        });
      }),
    );

    await this.orderItemRepository.save(orderItems);

    return this.findOne(savedOrderRequest.id);
  }

  async findAll(productTypeId?: string): Promise<OrderRequestResponseDto[]> {
    const query = this.orderRequestRepository
      .createQueryBuilder('orderRequest')
      .leftJoinAndSelect('orderRequest.customer', 'customer')
      .leftJoinAndSelect('orderRequest.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.productType', 'productType');

    if (productTypeId)
      query.where('productType.id = :productTypeId', { productTypeId });

    const orderRequests = await query.getMany();

    return orderRequests.map(this.toResponseDto);
  }

  async findByCustomer(customerId: string): Promise<OrderRequestResponseDto[]> {
    const orderRequests = await this.orderRequestRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer', 'orderItems', 'orderItems.productType'],
    });

    return orderRequests.map(this.toResponseDto);
  }

  async findOne(id: string): Promise<OrderRequestResponseDto> {
    const orderRequest = await this.orderRequestRepository.findOne({
      where: { id },
      relations: ['customer', 'orderItems', 'orderItems.productType'],
    });

    if (!orderRequest)
      throw new NotFoundException(`Order request with ID ${id} not found`);

    return this.toResponseDto(orderRequest);
  }

  async update(
    id: string,
    updateOrderRequestDto: UpdateOrderRequestDto,
  ): Promise<OrderRequestResponseDto> {
    const orderRequest = await this.orderRequestRepository.findOne({
      where: { id },
    });

    if (!orderRequest)
      throw new NotFoundException(`Order request with ID ${id} not found`);

    if (updateOrderRequestDto.title !== undefined)
      orderRequest.title = updateOrderRequestDto.title;

    if (updateOrderRequestDto.description !== undefined)
      orderRequest.description = updateOrderRequestDto.description;

    if (updateOrderRequestDto.expirationDate !== undefined)
      orderRequest.expirationDate = updateOrderRequestDto.expirationDate;

    await this.orderRequestRepository.save(orderRequest);

    if (updateOrderRequestDto.orderItems) {
      // Delete existing order items
      await this.orderItemRepository.delete({ orderRequest });

      // Create new order items
      const orderItems = await Promise.all(
        updateOrderRequestDto.orderItems.map(async item => {
          const productType = await this.productTypeRepository.findOne({
            where: { id: item.productTypeId },
          });

          if (!productType)
            throw new NotFoundException(
              `ProductType with ID ${item.productTypeId} not found`,
            );

          return this.orderItemRepository.create({
            orderRequest,
            productType, // Use the ProductType entity
            requestedQuantity: item.requestedQuantity,
            description: item.description,
          });
        }),
      );

      await this.orderItemRepository.save(orderItems);
    }

    return this.findOne(id);
  }

  async updateStatus(
    id: string,
    status: RequestStatus,
  ): Promise<OrderRequestResponseDto> {
    const orderRequest = await this.orderRequestRepository.findOne({
      where: { id },
    });

    if (!orderRequest)
      throw new NotFoundException(`Order request with ID ${id} not found`);

    orderRequest.status = status;
    await this.orderRequestRepository.save(orderRequest);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const orderRequest = await this.orderRequestRepository.findOne({
      where: { id },
    });

    if (!orderRequest)
      throw new NotFoundException(`Order request with ID ${id} not found`);

    await this.orderRequestRepository.remove(orderRequest);
  }

  private toResponseDto(orderRequest: OrderRequest): OrderRequestResponseDto {
    return {
      id: orderRequest.id,
      status: orderRequest.status,
      createdAt: orderRequest.createdAt,
      updatedAt: orderRequest.updatedAt,
      description: orderRequest.description,
      expirationDate: orderRequest.expirationDate,
      customer: orderRequest.customer
        ? {
            id: orderRequest.customer.id,
            email: orderRequest.customer.email,
            firstName: orderRequest.customer.firstName,
            lastName: orderRequest.customer.lastName,
            companyName: orderRequest.customer.companyName,
          }
        : undefined,
      orderItems:
        orderRequest.orderItems?.map(item => ({
          id: item.id,
          requestedQuantity: item.requestedQuantity,
          description: item.description,
          productType: item.productType
            ? {
                id: item.productType.id,
                name: item.productType.name,
                description: item.productType.description,
                imageUrl: item.productType.imageUrl,
              }
            : undefined,
        })) || [],
    };
  }
}
