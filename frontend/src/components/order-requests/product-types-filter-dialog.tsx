"use client";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProductType } from "@/lib/features/productTypes/productTypeSlice";

interface ProductTypesFilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productTypes: ProductType[];
  loadingProductTypes: boolean;
  selectedProductTypes: string[];
  onProductTypeToggle: (productTypeId: string) => void;
  onApplyFilter: () => void;
}

export function ProductTypesFilterDialog({
  isOpen,
  onOpenChange,
  productTypes,
  loadingProductTypes,
  selectedProductTypes,
  onProductTypeToggle,
  onApplyFilter,
}: ProductTypesFilterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Filter className="w-4 h-4 mr-2" />
          Filtrele
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ürün Tiplerine Göre Filtrele</DialogTitle>
          <DialogDescription>
            Belirli ürün tiplerini içeren sipariş taleplerini görüntülemek için
            seçim yapın.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {loadingProductTypes ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">
                Ürün tipleri yükleniyor...
              </p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {productTypes
                .filter((pt) => pt.isActive)
                .map((productType) => (
                  <div
                    key={productType.id}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => onProductTypeToggle(productType.id)}
                  >
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        selectedProductTypes.includes(productType.id)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedProductTypes.includes(productType.id) && (
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{productType.name}</p>
                      <p className="text-xs text-gray-500">
                        {productType.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button onClick={onApplyFilter}>Filtreyi Uygula</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
