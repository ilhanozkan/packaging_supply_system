"use client";

import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OrderRequest } from "@/lib/features/orderRequests/orderRequestSlice";

interface OrderItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderRequest: OrderRequest | null;
  title?: string;
}

export function OrderItemsModal({
  isOpen,
  onClose,
  orderRequest,
  title = "Ürün Kategorileri",
}: OrderItemsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {orderRequest?.title
              ? `"${orderRequest.title}" sipariş talebindeki ürün kategorilerinin detayları`
              : "Bu sipariş talebindeki ürün kategorilerinin detayları"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {orderRequest?.orderItems?.map((item, index) => (
            <Card
              key={item.id || index}
              className="bg-primary-background shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.productType?.imageUrl ? (
                      <img
                        src={item.productType.imageUrl}
                        alt={item.productType.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <Package className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-lg mb-1">
                      {item.productType?.name || "Bilinmeyen Ürün"}
                    </h4>

                    {item.productType?.description && (
                      <p className="text-gray-300 text-sm mb-2">
                        {item.productType.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center text-blue-300">
                        <Package className="w-4 h-4 mr-1" />
                        <span>Miktar: {item.requestedQuantity}</span>
                      </div>
                    </div>

                    {item.description && (
                      <div className="mt-2 p-2 bg-slate-600 rounded text-sm text-gray-300">
                        <span className="font-medium text-white">Not: </span>
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!orderRequest?.orderItems ||
            orderRequest.orderItems.length === 0) && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-300">Ürün kategorisi bulunamadı</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
