import { OrderItemResponseDto } from '../../order-item/dto/order-item-response.dto';

export class OrderRequestResponseDto {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  customer?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  orderItems: OrderItemResponseDto[];
  expirationDate: Date;
}
