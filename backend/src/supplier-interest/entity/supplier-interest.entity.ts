import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/user.entity';
import { OrderRequest } from '../../order-request/entity/order-request.entity';

@Entity()
export class SupplierInterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean')
  isInterested: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  offerPrice: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'supplierId' })
  supplier: User;

  @ManyToOne(() => OrderRequest, { eager: true })
  @JoinColumn({ name: 'orderRequestId' })
  orderRequest: OrderRequest;
}
