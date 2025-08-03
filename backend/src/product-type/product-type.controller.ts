import { Controller, Param } from '@nestjs/common';

import { ProductTypeService } from './product-type.service';
import { ProductTypeResponseDto } from './dto/product-type-response.dto';

@Controller('product-type')
export class ProductTypeController {
  constructor(private productTypeService: ProductTypeService) {}

  listAndFilterProductTypes(): Promise<ProductTypeResponseDto[]> {
    return this.productTypeService.listActiveProductTypes();
  }

  getProductType(@Param('id') id: string): Promise<ProductTypeResponseDto> {
    return this.productTypeService.getProductType(id);
  }
}
