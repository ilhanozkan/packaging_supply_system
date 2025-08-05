"use client";

import {
  Calendar,
  Package,
  User,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderRequest } from "@/lib/features/orderRequests/orderRequestSlice";
import { SupplierInterest } from "@/lib/features/supplierInterests/supplierInterestSlice";
import { SupplierInterestStatsGrid } from "./supplier-interest-stats-grid";

interface AdminSupplierInterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderRequest: OrderRequest | null;
  supplierInterests: SupplierInterest[];
}

export function AdminSupplierInterestsModal({
  isOpen,
  onClose,
  orderRequest,
  supplierInterests,
}: AdminSupplierInterestsModalProps) {
  if (!orderRequest) return null;

  const formatExpirationDate = (date: Date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Geçersiz tarih";
    }
  };

  const formatCreatedDate = (date: Date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Geçersiz tarih";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  const interestedSuppliers = supplierInterests.filter(
    (interest) => interest.isInterested
  );
  const notInterestedSuppliers = supplierInterests.filter(
    (interest) => !interest.isInterested
  );

  const sortedInterestedSuppliers = interestedSuppliers.sort((a, b) => {
    if (!a.offerPrice && !b.offerPrice) return 0;
    if (!a.offerPrice) return 1;
    if (!b.offerPrice) return -1;
    return a.offerPrice - b.offerPrice;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">
            {orderRequest.title} - Tedarikçi İlgi Durumları
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Bu sipariş talebine hangi tedarikçilerin ilgilendiği ve teklif
            verdiği görüntüleniyor.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>
                {orderRequest.customer?.companyName ||
                  `${orderRequest.customer?.firstName} ${orderRequest.customer?.lastName}` ||
                  "Bilinmeyen müşteri"}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                Son Başvuru: {formatExpirationDate(orderRequest.expirationDate)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Package className="w-4 h-4 mr-2" />
              <span>{orderRequest.orderItems.length} ürün kategorisi</span>
            </div>
          </div>
        </div>

        <SupplierInterestStatsGrid
          totalResponses={supplierInterests.length}
          interestedCount={interestedSuppliers.length}
          notInterestedCount={notInterestedSuppliers.length}
        />

        <div className="space-y-6">
          {interestedSuppliers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                İlgilenen Tedarikçiler ({interestedSuppliers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedInterestedSuppliers.map((interest, index) => (
                  <Card key={interest.id} className="border-green-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          {interest.supplier?.companyName ||
                            `${interest.supplier?.firstName} ${interest.supplier?.lastName}` ||
                            "Bilinmeyen tedarikçi"}
                        </CardTitle>
                        {index === 0 && interest.offerPrice && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            En Düşük Teklif
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {interest.offerPrice && (
                          <div className="text-lg font-bold text-green-600">
                            {formatPrice(interest.offerPrice)}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Yanıtlama Tarihi:{" "}
                          {formatCreatedDate(interest.createdAt)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {notInterestedSuppliers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                İlgilenmeyen Tedarikçiler ({notInterestedSuppliers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notInterestedSuppliers.map((interest) => (
                  <Card key={interest.id} className="border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        {interest.supplier?.companyName ||
                          `${interest.supplier?.firstName} ${interest.supplier?.lastName}` ||
                          "Bilinmeyen tedarikçi"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-gray-500">
                        Yanıtlama Tarihi:{" "}
                        {formatCreatedDate(interest.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {supplierInterests.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Package className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600">
                Bu sipariş talebine henüz hiç tedarikçi yanıt vermemiş.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
