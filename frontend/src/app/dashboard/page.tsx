"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { SupplierDashboard } from "@/components/dashboard/supplier-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { useAppSelector } from "@/lib/hooks";
import { UserRole } from "@/lib/features/auth/authSlice";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case UserRole.CUSTOMER:
        return <CustomerDashboard />;
      case UserRole.SUPPLIER:
        return <SupplierDashboard />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return <div>Kullanıcı rolü bilinmiyor</div>;
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>{renderDashboard()}</MainLayout>
    </ProtectedRoute>
  );
}
