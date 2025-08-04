"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchMyOrderRequests } from "@/lib/features/orderRequests/orderRequestSlice";
import { OrderRequestsList } from "@/components/order-requests/order-requests-list";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { UserRole } from "@/lib/features/auth/authSlice";

export default function OrderRequestsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: orderRequests, isLoading } = useAppSelector(
    (state) => state.orderRequests
  );

  useEffect(() => {
    dispatch(fetchMyOrderRequests());
  }, []);

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sipariş Taleplerim</h1>
            <Button onClick={() => router.push("/order-requests/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Oluştur
            </Button>
          </div>

          <OrderRequestsList
            orderRequests={orderRequests}
            isLoading={isLoading}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
