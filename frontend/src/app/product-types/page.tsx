'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { MainLayout } from '@/components/layout/main-layout';
import { ProductTypesList } from '@/components/product-types/product-types-list';
import { UserRole } from '@/lib/features/auth/authSlice';

export default function ProductTypesPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER, UserRole.SUPPLIER, UserRole.ADMIN]}>
      <MainLayout>
        <ProductTypesList />
      </MainLayout>
    </ProtectedRoute>
  );
}
