import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productTypeId: string;

  @IsNotEmpty()
  requestedQuantity: number;

  @IsOptional()
  @IsString()
  description?: string;
}
