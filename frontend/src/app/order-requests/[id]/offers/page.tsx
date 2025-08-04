"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, User, Calendar } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { OfferList } from "@/components/order-requests/offer-list";
import { UserRole } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchOrderRequestById,
  RequestStatus,
} from "@/lib/features/orderRequests/orderRequestSlice";
import { fetchSupplierInterestsByOrderRequest } from "@/lib/features/supplierInterests/supplierInterestSlice";

export default function OrderRequestOffersPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderId = params.id as string;

  const { currentItem: orderRequest, isLoading: orderLoading } = useAppSelector(
    (state) => state.orderRequests
  );
  const { items: offers, isLoading: offersLoading } = useAppSelector(
    (state) => state.supplierInterests
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderRequestById(orderId));
      dispatch(fetchSupplierInterestsByOrderRequest(orderId));
    }
  }, [orderId]);

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

  const handleAcceptOffer = (offerId: string) => {
    console.log("Todo: Accept offer:", offerId);
  };

  const handleRejectOffer = (offerId: string) => {
    console.log("Todo: Reject offer:", offerId);
  };

  if (orderLoading)
    return (
      <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
        <MainLayout>
          <div className="max-w-7xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );

  if (!orderRequest)
    return (
      <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
        <MainLayout>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sipariş talebi bulunamadı
              </h3>
              <p className="text-gray-500 mb-4">
                Aranan sipariş talebi mevcut değil veya erişim yetkiniz yok.
              </p>
              <Button onClick={() => router.push("/order-requests")}>
                Sipariş Taleplerine Dön
              </Button>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );

  const interestedOffers = offers.filter((offer) => offer.isInterested);

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/order-requests")}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
              <h1 className="text-2xl font-bold">Gelen Teklifler</h1>
            </div>
          </div>

          <Card className="bg-primary-background border-slate-600 mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-semibold text-white mb-2">
                    {orderRequest.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {orderRequest.description || "Açıklama mevcut değil"}
                  </CardDescription>
                </div>
                <Badge
                  variant={getStatusVariant(orderRequest.status)}
                  className={clsx(
                    "ml-4 shrink-0",
                    orderRequest.status === RequestStatus.COMPLETED &&
                      "text-white"
                  )}
                >
                  {getStatusText(orderRequest.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-sm text-gray-300">
                  <User className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">
                    {orderRequest.customer?.companyName ||
                      `${orderRequest.customer?.firstName} ${orderRequest.customer?.lastName}` ||
                      "Bilinmeyen müşteri"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Calendar className="w-4 h-4 mr-2 shrink-0" />
                  <span>
                    Son Başvuru:{" "}
                    {formatExpirationDate(orderRequest.expirationDate)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Package className="w-4 h-4 mr-2 shrink-0" />
                  <span>{orderRequest.orderItems.length} ürün kategorisi</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Gelen Teklifler ({interestedOffers.length})
              </h2>
            </div>

            <OfferList
              offers={interestedOffers}
              isLoading={offersLoading}
              onAcceptOffer={handleAcceptOffer}
              onRejectOffer={handleRejectOffer}
            />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
