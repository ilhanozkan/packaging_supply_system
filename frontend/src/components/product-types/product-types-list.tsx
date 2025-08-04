"use client";

import { useEffect, useState } from "react";
import { Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProductTypes } from "@/lib/features/productTypes/productTypeSlice";

export function ProductTypesList() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: productTypes, isLoading } = useAppSelector(
    (state) => state.productTypes
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProductTypes(searchTerm || undefined));
  }, []);

  const handleSearch = () => {
    dispatch(fetchProductTypes(searchTerm || undefined));
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ürün Tipleri</h1>
          <p className="text-muted-foreground">
            Ambalaj sipariş talepleriniz için mevcut ürün tiplerini inceleyin
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Ürün tipi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleOnKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Ara</Button>
      </div>

      {productTypes.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No ürün tipi bulundu
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Arama terimlerinizi ayarlamayı deneyin."
              : "Şu anda mevcut ürün tipleri yok."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productTypes.map((productType) => (
            <Card
              key={productType.id}
              className="cursor-pointer bg-primary-background shadow-lg"
              onClick={() =>
                router.push(`/order-requests/new?productType=${productType.id}`)
              }
            >
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  {productType.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-white">
                  {productType.description}
                </CardDescription>
                {productType.imageUrl && (
                  <div className="w-full rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={productType.imageUrl}
                      alt={productType.name}
                      className="w-full max-h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML =
                          '<Package class="h-8 w-8 text-gray-400" />';
                      }}
                    />
                  </div>
                )}
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/order-requests/new?productType=${productType.id}`
                    );
                  }}
                  className="w-full text-white bg-button-primary hover:bg-button-primary-hover font-semibold"
                >
                  Talep Oluştur
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
