"use client";

import { useState } from "react";
import { Calendar, DollarSign, User, Building } from "lucide-react";

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
import { SupplierInterest } from "@/lib/features/supplierInterests/supplierInterestSlice";

interface OfferListProps {
  offers: SupplierInterest[];
  isLoading: boolean;
  onAcceptOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
}

const ITEMS_PER_PAGE = 4;

export function OfferList({
  offers,
  isLoading,
  onAcceptOffer,
  onRejectOffer,
}: OfferListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
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

  const totalPages = Math.ceil(offers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOffers = offers.slice(startIndex, endIndex);

  const formatDate = (date: Date) => {
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

  const formatPrice = (price?: number) => {
    if (!price) return "Belirtilmemiş";
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  if (offers.length === 0)
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Henüz teklif yok
        </h3>
        <p className="text-gray-500">
          Bu sipariş talebi için henüz hiç teklif gelmemiş. Tedarikçiler
          tekliflerini gönderdikçe burada görünecekler.
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentOffers.map((offer) => (
          <Card
            key={offer.id}
            className="shadow-lg transition-shadow duration-200 bg-primary-background"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-white mb-2">
                    {offer.supplier?.companyName ||
                      `${offer.supplier?.firstName} ${offer.supplier?.lastName}` ||
                      "Bilinmeyen Tedarikçi"}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Teklif Tarihi: {formatDate(offer.createdAt)}
                  </CardDescription>
                </div>
                <Badge
                  variant={offer.isInterested ? "default" : "secondary"}
                  className="ml-2 shrink-0"
                >
                  {offer.isInterested ? "İlgilendim" : "İlgilenmedim"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <User className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">
                    {offer.supplier?.firstName} {offer.supplier?.lastName}
                  </span>
                </div>

                {offer.supplier?.companyName && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Building className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">
                      {offer.supplier.companyName}
                    </span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-300">
                  <Calendar className="w-4 h-4 mr-2 shrink-0" />
                  <span>Teklif Tarihi: {formatDate(offer.createdAt)}</span>
                </div>

                {offer.offerPrice && (
                  <div className="text-lg font-bold text-green-400">
                    <span>{formatPrice(offer.offerPrice)}</span>
                  </div>
                )}
              </div>

              {offer.isInterested && (
                <div className="pt-4 border-t border-slate-600">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="text-xs bg-button-primary hover:bg-button-primary-hover text-white font-semibold"
                      onClick={() => onAcceptOffer?.(offer.id)}
                    >
                      Kabul Et
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
                      onClick={() => onRejectOffer?.(offer.id)}
                    >
                      Reddet
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
