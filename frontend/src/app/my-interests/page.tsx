"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchMySupplierInterests } from "@/lib/features/supplierInterests/supplierInterestSlice";
import { UserRole } from "@/lib/features/auth/authSlice";
import { MyInterestsList } from "@/components/my-interests/my-interests-list";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";

export default function MyInterestsPage() {
  const dispatch = useAppDispatch();
  const { myInterests, isLoading } = useAppSelector(
    (state) => state.supplierInterests
  );

  useEffect(() => {
    dispatch(fetchMySupplierInterests());
  }, []);

  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPPLIER]}>
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              İlgilendiğim Siparişler
            </h1>
            <p className="text-gray-600">
              Teklif verdiğiniz ve ilgilendiğiniz sipariş talepleri
            </p>
          </div>

          <MyInterestsList
            myInterests={myInterests.toSorted(
              (a, b) => Number(b.isInterested) - Number(a.isInterested)
            )}
            isLoading={isLoading}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
