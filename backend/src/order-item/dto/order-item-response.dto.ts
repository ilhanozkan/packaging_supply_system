export class OrderItemResponseDto {
  id: string;
  requestedQuantity: number;
  description?: string;
  productType?: {
    id: string;
    name: string;
    description: string;
  };
}
