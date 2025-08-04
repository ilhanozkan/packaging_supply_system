"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getProfile } from "@/lib/features/auth/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    // If we have a token but no user, try to get the profile
    if (storedToken && !isAuthenticated) dispatch(getProfile());
  }, [isAuthenticated]);

  return <>{children}</>;
}
