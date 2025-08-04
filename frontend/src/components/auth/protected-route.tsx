"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/lib/hooks";
import { UserRole } from "@/lib/features/auth/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) return router.push("/login");

      if (isAuthenticated && user && allowedRoles.length > 0)
        if (!allowedRoles.includes(user.role))
          return router.push("/unauthorized");
    }
  }, [isAuthenticated, user, isLoading, router, allowedRoles, requireAuth]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );

  if (requireAuth && !isAuthenticated) return null;

  if (
    isAuthenticated &&
    user &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  )
    return null;

  return <>{children}</>;
}
