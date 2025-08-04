import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductTypeResponseDto } from '../dto/product-type-response.dto';

@Entity()
export class ProductType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  imageUrl?: string;

  toResponseObject(): ProductTypeResponseDto {
    const { id, name, description, createdAt, isActive, imageUrl } = this;

    const responseObject: ProductTypeResponseDto = {
      id,
      name,
      description,
      createdAt,
      isActive,
    };

    if (imageUrl) responseObject.imageUrl = imageUrl;

    return responseObject;
  }
}
