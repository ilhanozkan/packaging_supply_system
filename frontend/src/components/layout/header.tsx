"use client";

import { useRouter } from "next/navigation";
import { LogOut, Package, ShoppingCart, Users, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout, UserRole } from "@/lib/features/auth/authSlice";

const UserRoleTranslations: Record<UserRole, string> = {
  customer: "Müşteri",
  supplier: "Tedarikçi",
  admin: "Yönetici",
};

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Başarıyla çıkış yaptınız");
    router.push("/login");
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  if (!isAuthenticated || !user) return null;

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-gray-900">
            Ambalaj Tedarik Sistemi
          </h1>

          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="text-sm"
            >
              Dashboard
            </Button>

            {user.role === UserRole.CUSTOMER && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/order-requests")}
                  className="text-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Sipariş Taleplerim
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/order-requests/new")}
                  className="text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Talep
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/product-types")}
                  className="text-sm"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Ürün Tipleri
                </Button>
              </>
            )}

            {user.role === UserRole.SUPPLIER && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/order-requests")}
                  className="text-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Sipariş Talepleri
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/my-interests")}
                  className="text-sm"
                >
                  İlgilendiğim Siparişler
                </Button>
              </>
            )}

            {user.role === UserRole.ADMIN && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/admin/users")}
                  className="text-sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Kullanıcılar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/admin/product-types")}
                  className="text-sm"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Ürün Tipleri
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/admin/order-requests")}
                  className="text-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Sipariş Talepleri
                </Button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {UserRoleTranslations[user.role] || "Kullanıcı"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
