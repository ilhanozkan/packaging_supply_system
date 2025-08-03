import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductType } from './entity/product-type.entity';
import { ProductTypeResponseDto } from './dto/product-type-response.dto';
import { ProductTypeDto } from './dto/product-type.dto';

import { UserRole } from '../user/enum/user-role.enum';
import { Roles } from '../auth/decorator/roles.decorator';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
  ) {}

  @Roles(UserRole.ADMIN)
  async listAllProductTypes(): Promise<ProductTypeDto[]> {
    return await this.productTypeRepository.find();
  }

  async listActiveProductTypes(): Promise<ProductTypeResponseDto[]> {
    const productTypes = await this.productTypeRepository.findBy({
      isActive: true,
    });

    return productTypes.map(productType => productType.toResponseObject());
  }

  async createProductType(
    data: ProductTypeDto,
  ): Promise<ProductTypeResponseDto> {
    const productType = this.productTypeRepository.create(data);
    await this.productTypeRepository.save(productType);
    return productType.toResponseObject();
  }

  async getProductType(id: string): Promise<ProductTypeResponseDto> {
    return this.productTypeRepository.findOneOrFail({
      where: { id },
    });
  }

  async updateProductType(
    id: string,
    data: ProductTypeDto,
  ): Promise<ProductTypeResponseDto> {
    await this.productTypeRepository.update(id, data);
    return this.getProductType(id);
  }

  async deleteProductType(id: string): Promise<void> {
    await this.productTypeRepository.delete(id);
  }
}
