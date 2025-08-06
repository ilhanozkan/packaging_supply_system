"use client";

import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <ShieldX className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="text-2xl">Yetkisiz Erişim</CardTitle>
          <CardDescription>Bu sayfaya erişim izniniz yok.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Bu sayfa, hesabınızın sahip olmadığı belirli izinler gerektiriyor.
            Lütfen bunun bir hata olduğunu düşünüyorsanız yöneticinizle
            iletişime geçin.
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex-1"
            >
              Geri Dön
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1"
            >
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
