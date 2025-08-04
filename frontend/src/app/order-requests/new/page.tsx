"use client";

import { CreateOrderRequestForm } from "@/components/order-requests/create-order-request-form";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/features/auth/authSlice";

export default function NewOrderRequestPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <CreateOrderRequestForm />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
