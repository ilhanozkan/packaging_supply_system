import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productTypeId: string;

  @IsNotEmpty()
  requestedQuantity: number;
}
