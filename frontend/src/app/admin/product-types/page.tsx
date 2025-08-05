"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { AdminProductTypesList } from "@/components/product-types/admin-product-types-list";
import { UserRole } from "@/lib/features/auth/authSlice";

export default function AdminProductTypesPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <AdminProductTypesList />
      </MainLayout>
    </ProtectedRoute>
  );
}
