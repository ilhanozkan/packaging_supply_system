import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateSupplierInterestDto {
  @IsOptional()
  @IsBoolean()
  isInterested?: boolean;

  @IsOptional()
  @IsNumber()
  offerPrice?: number;
}
