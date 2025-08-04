"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/lib/hooks";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) router.push("/dashboard");
      else router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}
