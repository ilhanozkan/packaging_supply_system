"use client";

import { useState } from "react";
import { Calendar, Package, User } from "lucide-react";
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
import { Pagination } from "@/components/ui/pagination";
import { OrderItemsModal } from "@/components/order-requests/order-items-modal";
import { SupplierInterestDialog } from "@/components/order-requests/supplier-interest-dialog";
import {
  OrderRequest,
  RequestStatus,
} from "@/lib/features/orderRequests/orderRequestSlice";
import { UserRole } from "@/lib/features/auth/authSlice";

interface OrderRequestsListProps {
  orderRequests: OrderRequest[];
  isLoading: boolean;
  role?: string;
}

const ITEMS_PER_PAGE = 6;

export function OrderRequestsList({
  orderRequests,
  isLoading,
  role,
}: OrderRequestsListProps) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderForModal, setSelectedOrderForModal] =
    useState<OrderRequest | null>(null);
  const [supplierInterestDialog, setSupplierInterestDialog] = useState<{
    isOpen: boolean;
    orderRequest: OrderRequest | null;
    isInterested: boolean;
  }>({
    isOpen: false,
    orderRequest: null,
    isInterested: true,
  });

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );

  const totalPages = Math.ceil(orderRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = orderRequests.slice(startIndex, endIndex);

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

  const handleOfferClick = (orderRequest: OrderRequest) => {
    setSupplierInterestDialog({
      isOpen: true,
      orderRequest,
      isInterested: true,
    });
  };

  const handleNotInterestedClick = (orderRequest: OrderRequest) => {
    setSupplierInterestDialog({
      isOpen: true,
      orderRequest,
      isInterested: false,
    });
  };

  const closeSupplierInterestDialog = () => {
    setSupplierInterestDialog({
      isOpen: false,
      orderRequest: null,
      isInterested: true,
    });
  };

  if (orderRequests.length === 0)
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Henüz sipariş talebi yok
        </h3>
        {role === UserRole.CUSTOMER && (
          <p className="text-gray-500">
            İlk sipariş talebinizi oluşturmak için yukarıdaki "Oluştur" butonuna
            tıklayın.
          </p>
        )}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentOrders.map((order) => (
          <Card
            key={order.id}
            className="shadow-lg transition-shadow duration-200 bg-primary-background border-slate-600"
          >
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
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <User className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">
                    {order.customer?.companyName ||
                      `${order.customer?.firstName} ${order.customer?.lastName}` ||
                      "Bilinmeyen müşteri"}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-300">
                  <Calendar className="w-4 h-4 mr-2 shrink-0" />
                  <span>
                    Son Başvuru: {formatExpirationDate(order.expirationDate)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-300">
                  <Package className="w-4 h-4 mr-2 shrink-0" />
                  <button
                    onClick={() => setSelectedOrderForModal(order)}
                    className="hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
                  >
                    {order.orderItems.length} ürün kategorisi
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-600">
                {role === UserRole.CUSTOMER ? (
                  <>
                    <Button
                      size="sm"
                      className="text-xs border-slate-500 mb-2 bg-button-primary hover:bg-button-primary-hover font-semibold"
                      onClick={() =>
                        router.push(`/order-requests/${order.id}/offers`)
                      }
                    >
                      Gelen Teklifleri Gör
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="text-xs border-slate-500 bg-button-primary hover:bg-button-primary-hover font-semibold"
                      >
                        Düzenle
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
                      >
                        Sil
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="text-xs border-slate-500 bg-button-primary hover:bg-button-primary-hover font-semibold"
                      onClick={() => handleOfferClick(order)}
                    >
                      Teklif Ver
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
                      onClick={() => handleNotInterestedClick(order)}
                    >
                      İlgilenmiyorum
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <OrderItemsModal
        isOpen={!!selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
        orderRequest={selectedOrderForModal}
      />

      <SupplierInterestDialog
        isOpen={supplierInterestDialog.isOpen}
        onClose={closeSupplierInterestDialog}
        orderRequestId={supplierInterestDialog.orderRequest?.id || ""}
        orderTitle={supplierInterestDialog.orderRequest?.title || ""}
        isInterested={supplierInterestDialog.isInterested}
      />
    </div>
  );
}
