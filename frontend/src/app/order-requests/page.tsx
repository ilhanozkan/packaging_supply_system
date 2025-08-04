"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchMyOrderRequests,
  fetchOrderRequests,
} from "@/lib/features/orderRequests/orderRequestSlice";
import { fetchProductTypes } from "@/lib/features/productTypes/productTypeSlice";
import { OrderRequestsList } from "@/components/order-requests/order-requests-list";
import { ProductTypesFilterDialog } from "@/components/order-requests/product-types-filter-dialog";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { UserRole } from "@/lib/features/auth/authSlice";
import { Badge } from "@/components/ui/badge";

export default function OrderRequestsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: orderRequests, isLoading } = useAppSelector(
    (state) => state.orderRequests
  );
  const { items: productTypes, isLoading: loadingProductTypes } =
    useAppSelector((state) => state.productTypes);
  const { user, isProfileFetched } = useAppSelector((state) => state.auth);

  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    []
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const pageTitle =
    user?.role === UserRole.CUSTOMER
      ? "Sipariş Taleplerim"
      : "Sipariş Talepleri";

  const isSupplierOrAdmin =
    user?.role === UserRole.SUPPLIER || user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (isProfileFetched) {
      if (isSupplierOrAdmin) {
        dispatch(fetchOrderRequests(undefined));
        dispatch(fetchProductTypes());
      } else dispatch(fetchMyOrderRequests());
    }
  }, [isProfileFetched, isSupplierOrAdmin]);

  const handleProductTypeToggle = (productTypeId: string) => {
    setSelectedProductTypes((prev) =>
      prev.includes(productTypeId)
        ? prev.filter((id) => id !== productTypeId)
        : [...prev, productTypeId]
    );
  };

  const handleApplyFilter = () => {
    if (isSupplierOrAdmin)
      dispatch(
        fetchOrderRequests(
          selectedProductTypes.length > 0 ? selectedProductTypes : undefined
        )
      );

    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedProductTypes([]);
    if (isSupplierOrAdmin) dispatch(fetchOrderRequests(undefined));
  };

  const selectedProductNames = selectedProductTypes
    .map((id) => productTypes.find((pt) => pt.id === id)?.name)
    .filter(Boolean);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{pageTitle}</h1>

            {user?.role === UserRole.CUSTOMER ? (
              <Button onClick={() => router.push("/order-requests/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Oluştur
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                {selectedProductTypes.length > 0 && (
                  <div className="flex items-center gap-2">
                    {selectedProductNames.slice(0, 5).map((name, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {name}
                      </Badge>
                    ))}
                    {selectedProductNames.length > 5 && (
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-600"
                      >
                        +{selectedProductNames.length - 5}
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                <ProductTypesFilterDialog
                  isOpen={isFilterModalOpen}
                  onOpenChange={setIsFilterModalOpen}
                  productTypes={productTypes}
                  loadingProductTypes={loadingProductTypes}
                  selectedProductTypes={selectedProductTypes}
                  onProductTypeToggle={handleProductTypeToggle}
                  onApplyFilter={handleApplyFilter}
                />
              </div>
            )}
          </div>

          <OrderRequestsList
            orderRequests={orderRequests}
            isLoading={isLoading}
            role={user?.role}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
