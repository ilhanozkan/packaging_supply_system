"use client";

import { useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { OrderRequestsList } from "@/components/order-requests/order-requests-list";
import { UserRole } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchOrderRequests } from "@/lib/features/orderRequests/orderRequestSlice";

export default function AdminOrderRequestsPage() {
  const dispatch = useAppDispatch();
  const { items: orderRequests, isLoading } = useAppSelector(
    (state) => state.orderRequests
  );

  useEffect(() => {
    dispatch(fetchOrderRequests(undefined));
  }, [dispatch]);

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <OrderRequestsList
          orderRequests={orderRequests}
          isLoading={isLoading}
          role="admin"
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
