import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductType } from './entity/product-type.entity';
import { ProductTypeResponseDto } from './dto/product-type-response.dto';
import { ProductTypeDto } from './dto/product-type.dto';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { mockData } from './mock-data/mock-data';

import { UserRole } from '../user/enum/user-role.enum';
import { Roles } from '../auth/decorator/roles.decorator';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
  ) {}

  @Roles(UserRole.ADMIN)
  async listAllProductTypes(searchName?: string): Promise<ProductTypeDto[]> {
    if (searchName) {
      return await this.productTypeRepository
        .createQueryBuilder('productType')
        .where('LOWER(productType.name) LIKE LOWER(:name)', {
          name: `%${searchName}%`,
        })
        .getMany();
    }
    return await this.productTypeRepository.find();
  }

  async listActiveProductTypes(
    searchName?: string,
  ): Promise<ProductTypeResponseDto[]> {
    let query = this.productTypeRepository
      .createQueryBuilder('productType')
      .where('productType.isActive = :isActive', { isActive: true });

    if (searchName) {
      query = query.andWhere('LOWER(productType.name) LIKE LOWER(:name)', {
        name: `%${searchName}%`,
      });
    }

    const productTypes = await query.getMany();
    return productTypes.map(productType => productType.toResponseObject());
  }

  async createProductType(
    data: CreateProductTypeDto,
  ): Promise<ProductTypeResponseDto> {
    const productType = this.productTypeRepository.create(data);
    await this.productTypeRepository.save(productType);
    return productType.toResponseObject();
  }

  async getProductType(id: string): Promise<ProductTypeResponseDto> {
    const productType = await this.productTypeRepository.findOne({
      where: { id },
    });

    if (!productType) {
      throw new NotFoundException(`Product type with ID ${id} not found`);
    }

    return productType.toResponseObject();
  }

  async updateProductType(
    id: string,
    data: UpdateProductTypeDto,
  ): Promise<ProductTypeResponseDto> {
    const productType = await this.productTypeRepository.findOne({
      where: { id },
    });

    if (!productType) {
      throw new NotFoundException(`Product type with ID ${id} not found`);
    }

    await this.productTypeRepository.update(id, data);
    return this.getProductType(id);
  }

  async deleteProductType(id: string): Promise<void> {
    const productType = await this.productTypeRepository.findOne({
      where: { id },
    });

    if (!productType) {
      throw new NotFoundException(`Product type with ID ${id} not found`);
    }

    await this.productTypeRepository.remove(productType);
  }

  async initializeProductTypes(): Promise<void> {
    const count = await this.productTypeRepository.count();

    if (count === 0) {
      const productTypes = mockData.map(data =>
        this.productTypeRepository.create({
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          isActive: true,
        }),
      );

      await this.productTypeRepository.save(productTypes);
    }
  }
}
