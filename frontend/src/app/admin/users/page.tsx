"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { AdminUsersList } from "@/components/users/admin-users-list";
import { UserRole } from "@/lib/features/auth/authSlice";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <AdminUsersList />
      </MainLayout>
    </ProtectedRoute>
  );
}
