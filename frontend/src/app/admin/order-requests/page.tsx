"use client";

import { useEffect } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { AdminOrderRequestsList } from "@/components/order-requests/admin-order-requests-list";
import { UserRole } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchOrderRequests } from "@/lib/features/orderRequests/orderRequestSlice";
import { fetchAllSupplierInterests } from "@/lib/features/supplierInterests/supplierInterestSlice";

export default function AdminOrderRequestsPage() {
  const dispatch = useAppDispatch();
  const { items: orderRequests, isLoading: orderRequestsLoading } =
    useAppSelector((state) => state.orderRequests);
  const { items: supplierInterests, isLoading: supplierInterestsLoading } =
    useAppSelector((state) => state.supplierInterests);

  useEffect(() => {
    dispatch(fetchOrderRequests(undefined));
    dispatch(fetchAllSupplierInterests());
  }, [dispatch]);

  const isLoading = orderRequestsLoading || supplierInterestsLoading;

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <AdminOrderRequestsList
            orderRequests={orderRequests}
            supplierInterests={supplierInterests}
            isLoading={isLoading}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
