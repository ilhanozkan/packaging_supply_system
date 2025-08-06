"use client";

import { useState } from "react";
import {
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  Edit2,
} from "lucide-react";
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
import { SupplierInterest } from "@/lib/features/supplierInterests/supplierInterestSlice";
import { OrderRequest } from "@/lib/features/orderRequests/orderRequestSlice";

import { EditOfferDialog } from "./edit-offer-dialog";

interface MyInterestsListProps {
  myInterests: SupplierInterest[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 6;

export function MyInterestsList({
  myInterests,
  isLoading,
}: MyInterestsListProps) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<
    SupplierInterest["orderRequest"] | null
  >(null);
  const [editOfferDialog, setEditOfferDialog] = useState<{
    isOpen: boolean;
    interest: SupplierInterest | null;
  }>({
    isOpen: false,
    interest: null,
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

  const totalPages = Math.ceil(myInterests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInterests = myInterests.slice(startIndex, endIndex);

  const getInterestVariant = (isInterested: boolean) => {
    return isInterested ? "secondary" : "destructive";
  };

  const getInterestText = (isInterested: boolean) => {
    return isInterested ? "İlgiliyim" : "İlgilenmiyorum";
  };

  const formatDate = (date: Date) => {
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

  const formatPrice = (price?: number) => {
    if (!price) return "Belirtilmemiş";
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  const handleEditOffer = (interest: SupplierInterest) => {
    setEditOfferDialog({
      isOpen: true,
      interest,
    });
  };

  const closeEditOfferDialog = () => {
    setEditOfferDialog({
      isOpen: false,
      interest: null,
    });
  };

  if (myInterests.length === 0)
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Henüz ilgilendiğiniz sipariş yok
        </h3>
        <p className="text-gray-500 mb-4">
          Sipariş talepleri sayfasından ilgilendiğiniz siparişlere teklif
          verebilirsiniz.
        </p>
        <Button
          onClick={() => router.push("/order-requests")}
          className="bg-button-primary hover:bg-button-primary-hover"
        >
          Sipariş Talepleri
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentInterests.map((interest) => (
          <Card
            key={interest.id}
            className="bg-primary-background shadow-lg transition-shadow duration-200 hover:shadow-xl"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-white line-clamp-2 mb-2">
                    {interest.orderRequest?.title || "Başlık Mevcut Değil"}
                  </CardTitle>
                  <CardDescription className="text-gray-300 line-clamp-2">
                    {interest.orderRequest?.description ||
                      "Açıklama mevcut değil"}
                  </CardDescription>
                </div>
                <Badge
                  variant={getInterestVariant(interest.isInterested)}
                  className="ml-2 shrink-0"
                >
                  {interest.isInterested ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {getInterestText(interest.isInterested)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4 mt-auto">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-white">
                  <Calendar className="w-4 h-4 mr-2 shrink-0" />
                  <span>
                    Son Başvuru:{" "}
                    {formatDate(
                      interest.orderRequest?.expirationDate || new Date()
                    )}
                  </span>
                </div>

                {interest.orderRequest && (
                  <div className="flex items-center text-sm text-white">
                    <Package className="w-4 h-4 mr-2 shrink-0" />
                    <button
                      onClick={() =>
                        setSelectedOrderForModal(interest.orderRequest)
                      }
                      className="hover:text-gray-100 transition-colors cursor-pointer underline-offset-2 hover:underline"
                    >
                      Ürün detaylarını gör
                    </button>
                  </div>
                )}

                {interest.isInterested && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-button-primary">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-button-primary-hover">
                        Fiyat Teklifiniz:
                      </span>
                      <span className="text-lg font-bold text-orange-800">
                        {formatPrice(interest.offerPrice)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-200">
                  <b>Teklif Tarihi</b>: {formatDate(interest.createdAt)}
                </div>
              </div>

              {interest.isInterested && (
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    size="sm"
                    className="w-full text-xs bg-button-primary hover:bg-button-primary-hover font-semibold"
                    onClick={() => handleEditOffer(interest)}
                  >
                    <Edit2 className="w-3 h-3 mr-1 font-semibold" />
                    Teklifi Düzenle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <OrderItemsModal
        isOpen={!!selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
        orderRequest={(selectedOrderForModal as OrderRequest) || null}
      />

      <EditOfferDialog
        isOpen={editOfferDialog.isOpen}
        onClose={closeEditOfferDialog}
        interest={editOfferDialog.interest}
      />
    </div>
  );
}
