export class SupplierInterestResponseDto {
  id: string;
  isInterested: boolean;
  createdAt: Date;
  updatedAt: Date;
  offerPrice?: number;
  supplier?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  orderRequest?: {
    id: string;
    description?: string;
    status: string;
  };
}
