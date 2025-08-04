import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/user.entity';
import { RequestStatus } from '../enum/request-status.enum';
import { OrderItem } from '../../order-item/entity/order-item.entity';

@Entity()
export class OrderRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.ACTIVE,
  })
  status: RequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.orderRequest, {
    cascade: true,
    eager: true,
  })
  orderItems: OrderItem[];

  @Column({
    type: 'date',
    nullable: false,
  })
  expirationDate: Date;
}
