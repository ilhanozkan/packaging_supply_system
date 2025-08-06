import { Calendar, Package, User } from "lucide-react";

import { OrderRequest } from "@/lib/features/orderRequests/orderRequestSlice";

import { InfoItem } from "./info-item";

interface OrderInfoSectionProps {
  order: OrderRequest;
  onShowOrderItems: (order: OrderRequest) => void;
  formatExpirationDate: (date: Date) => string;
}

export function OrderInfoSection({
  order,
  onShowOrderItems,
  formatExpirationDate,
}: OrderInfoSectionProps) {
  const customerName =
    order.customer?.companyName ||
    `${order.customer?.firstName} ${order.customer?.lastName}` ||
    "Bilinmeyen müşteri";

  return (
    <div className="space-y-3">
      <InfoItem icon={User}>
        <span className="truncate">{customerName}</span>
      </InfoItem>

      <InfoItem icon={Calendar}>
        <span>Son Başvuru: {formatExpirationDate(order.expirationDate)}</span>
      </InfoItem>

      <InfoItem
        icon={Package}
        isClickable
        onClick={() => onShowOrderItems(order)}
      >
        {order.orderItems.length} ürün kategorisi
      </InfoItem>
    </div>
  );
}
