export class OrderItemResponseDto {
  id: string;
  requestedQuantity: number;
  productType?: {
    id: string;
    name: string;
  };
}
