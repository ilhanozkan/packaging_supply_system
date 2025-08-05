import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SupplierInterest } from './entity/supplier-interest.entity';
import { SupplierInterestResponseDto } from './dto/supplier-interest-response.dto';
import { CreateSupplierInterestDto } from './dto/create-supplier-interest.dto';
import { UpdateSupplierInterestDto } from './dto/update-supplier-interest.dto';

import { User } from '../user/user.entity';

@Injectable()
export class SupplierInterestService {
  constructor(
    @InjectRepository(SupplierInterest)
    private readonly supplierInterestRepository: Repository<SupplierInterest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    supplierId: string,
    createSupplierInterestDto: CreateSupplierInterestDto,
  ): Promise<SupplierInterestResponseDto> {
    const supplier = await this.userRepository.findOne({
      where: { id: supplierId },
    });

    if (!supplier)
      throw new NotFoundException(`Tedarikçi ${supplierId} bulunamadı`);

    const existingInterest = await this.supplierInterestRepository.findOne({
      where: {
        supplier: { id: supplierId },
        orderRequest: { id: createSupplierInterestDto.orderRequestId },
      },
    });

    if (existingInterest)
      throw new ConflictException(
        `Tedarikçi bu sipariş talebine zaten ilgi göstermiş`,
      );

    const supplierInterest = this.supplierInterestRepository.create({
      supplier,
      orderRequest: { id: createSupplierInterestDto.orderRequestId },
      isInterested: createSupplierInterestDto.isInterested,
      offerPrice: createSupplierInterestDto.offerPrice,
    });

    const savedInterest =
      await this.supplierInterestRepository.save(supplierInterest);
    return this.findOne(savedInterest.id);
  }

  async findAll(): Promise<SupplierInterestResponseDto[]> {
    const interests = await this.supplierInterestRepository.find({
      relations: ['supplier', 'orderRequest'],
    });

    return interests.map(this.toResponseDto);
  }

  async findBySupplier(
    supplierId: string,
  ): Promise<SupplierInterestResponseDto[]> {
    const interests = await this.supplierInterestRepository.find({
      where: { supplier: { id: supplierId } },
      relations: ['supplier', 'orderRequest'],
    });

    return interests.map(this.toResponseDto);
  }

  async findByOrderRequest(
    orderRequestId: string,
  ): Promise<SupplierInterestResponseDto[]> {
    const interests = await this.supplierInterestRepository.find({
      where: { orderRequest: { id: orderRequestId } },
      relations: ['supplier', 'orderRequest'],
    });

    return interests.map(this.toResponseDto);
  }

  async findOne(id: string): Promise<SupplierInterestResponseDto> {
    const interest = await this.supplierInterestRepository.findOne({
      where: { id },
      relations: ['supplier', 'orderRequest'],
    });

    if (!interest)
      throw new NotFoundException(`Tedarikçi ilgi kaydı ${id} bulunamadı`);

    return this.toResponseDto(interest);
  }

  async update(
    id: string,
    updateSupplierInterestDto: UpdateSupplierInterestDto,
  ): Promise<SupplierInterestResponseDto> {
    const interest = await this.supplierInterestRepository.findOne({
      where: { id },
    });

    if (!interest)
      throw new NotFoundException(`Tedarikçi ilgi kaydı ${id} bulunamadı`);

    if (updateSupplierInterestDto.isInterested !== undefined)
      interest.isInterested = updateSupplierInterestDto.isInterested;

    if (updateSupplierInterestDto.offerPrice !== undefined)
      interest.offerPrice = updateSupplierInterestDto.offerPrice;

    await this.supplierInterestRepository.save(interest);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const interest = await this.supplierInterestRepository.findOne({
      where: { id },
    });

    if (!interest)
      throw new NotFoundException(`Tedarikçi ilgi kaydı ${id} bulunamadı`);

    await this.supplierInterestRepository.remove(interest);
  }

  private toResponseDto(
    interest: SupplierInterest,
  ): SupplierInterestResponseDto {
    return {
      id: interest.id,
      isInterested: interest.isInterested,
      createdAt: interest.createdAt,
      updatedAt: interest.updatedAt,
      offerPrice: interest.offerPrice,
      supplier: interest.supplier
        ? {
            id: interest.supplier.id,
            email: interest.supplier.email.slice(0, 2) + '***' + '@***',
            firstName: interest.supplier.firstName.slice(0, 2) + '***',
            lastName: interest.supplier.lastName.slice(0, 2) + '***',
            companyName: interest.supplier.companyName,
          }
        : undefined,
      orderRequest: interest.orderRequest
        ? {
            id: interest.orderRequest.id,
            title: interest.orderRequest.title,
            description: interest.orderRequest.description,
            status: interest.orderRequest.status,
            orderItems: interest.orderRequest.orderItems?.map(item => ({
              id: item.id,
              requestedQuantity: item.requestedQuantity,
              productType: item.productType
                ? {
                    id: item.productType.id,
                    name: item.productType.name,
                    description: item.productType.description,
                    imageUrl: item.productType.imageUrl,
                  }
                : undefined,
            })),
          }
        : undefined,
    };
  }
}
