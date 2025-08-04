import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateSupplierInterestDto {
  @IsNotEmpty()
  @IsUUID()
  orderRequestId: string;

  @IsNotEmpty()
  @IsBoolean()
  isInterested: boolean;

  @IsOptional()
  @IsNumber()
  offerPrice?: number;
}
