import { Eye, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  OrderRequest,
  RequestStatus,
} from "@/lib/features/orderRequests/orderRequestSlice";

import { OrderInfoSection } from "./order-info-section";
import { SupplierResponseStats } from "./supplier-response-stats";

interface OrderRequestCardProps {
  order: OrderRequest;
  interestedCount: number;
  notInterestedCount: number;
  totalSupplierResponses: number;
  onShowOrderItems: (order: OrderRequest) => void;
  onShowInterests: (order: OrderRequest) => void;
  formatExpirationDate: (date: Date) => string;
}

export function OrderRequestCard({
  order,
  interestedCount,
  notInterestedCount,
  totalSupplierResponses,
  onShowOrderItems,
  onShowInterests,
  formatExpirationDate,
}: OrderRequestCardProps) {
  const router = useRouter();

  const getStatusVariant = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.ACTIVE:
        return "secondary";
      case RequestStatus.INACTIVE:
        return "default";
      case RequestStatus.COMPLETED:
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.ACTIVE:
        return "Aktif";
      case RequestStatus.INACTIVE:
        return "Pasif";
      case RequestStatus.COMPLETED:
        return "Tamamlandı";
      default:
        return "Bilinmiyor";
    }
  };

  return (
    <Card className="shadow-lg transition-shadow duration-200 bg-primary-background border-slate-600">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-white line-clamp-2 mb-2">
              {order.title}
            </CardTitle>
            <CardDescription className="text-gray-300 line-clamp-2">
              {order.description || "Açıklama mevcut değil"}
            </CardDescription>
          </div>
          <Badge
            variant={getStatusVariant(order.status)}
            className="ml-2 shrink-0"
          >
            {getStatusText(order.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4 mt-auto">
        <OrderInfoSection
          order={order}
          onShowOrderItems={onShowOrderItems}
          formatExpirationDate={formatExpirationDate}
        />

        <div className="bg-slate-800/50 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              <span>Tedarikçi Yanıtları</span>
            </div>
            <button
              onClick={() => onShowInterests(order)}
              className="text-gray-300 hover:text-gray-400 transition-colors text-xs font-medium"
            >
              Detayları Gör
            </button>
          </div>

          <SupplierResponseStats
            totalResponses={totalSupplierResponses}
            interestedCount={interestedCount}
            notInterestedCount={notInterestedCount}
          />
        </div>

        <div className="pt-2">
          <Button
            size="sm"
            className="text-xs border-slate-500 bg-button-primary hover:bg-button-primary-hover font-semibold w-full"
            onClick={() => router.push(`/order-requests/${order.id}/offers`)}
          >
            <Eye className="w-3 h-3 mr-1" />
            Teklifleri Görüntüle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
