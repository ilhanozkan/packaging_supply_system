"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { CreateProductTypeForm } from "@/components/product-types/create-product-type-form";
import { UserRole } from "@/lib/features/auth/authSlice";

export default function NewProductTypePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <CreateProductTypeForm />
      </MainLayout>
    </ProtectedRoute>
  );
}
