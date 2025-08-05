"use client";

import { use } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { EditProductTypeForm } from "@/components/product-types/edit-product-type-form";
import { UserRole } from "@/lib/features/auth/authSlice";

export default function EditProductTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <EditProductTypeForm productTypeId={id} />
      </MainLayout>
    </ProtectedRoute>
  );
}
