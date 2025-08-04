import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderRequest } from '../../order-request/entity/order-request.entity';
import { ProductType } from '../../product-type/entity/product-type.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  requestedQuantity: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ManyToOne(() => OrderRequest, orderRequest => orderRequest.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderRequestId' })
  orderRequest: OrderRequest;

  @ManyToOne(() => ProductType, { eager: true })
  @JoinColumn({ name: 'productTypeId' })
  productType: ProductType;
}
