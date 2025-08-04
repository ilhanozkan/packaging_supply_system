"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/lib/hooks";

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [hasToken, setHasToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    setIsChecking(false);

    if (token || isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  if (isChecking || hasToken || isAuthenticated) return null;

  return <>{children}</>;
}
