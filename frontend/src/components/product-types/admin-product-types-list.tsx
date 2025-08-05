"use client";

import { useEffect, useState } from "react";
import { Package, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllProductTypes,
  deleteProductType,
  updateProductType,
} from "@/lib/features/productTypes/productTypeSlice";

export function AdminProductTypesList() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: productTypes, isLoading } = useAppSelector(
    (state) => state.productTypes
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllProductTypes(searchTerm || undefined));
  }, []);

  const handleSearch = () => {
    dispatch(fetchAllProductTypes(searchTerm || undefined));
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `"${name}" ürün tipini silmek istediğinizden emin misiniz?`
      )
    ) {
      try {
        await dispatch(deleteProductType(id)).unwrap();
        toast.success("Ürün tipi başarıyla silindi");
        dispatch(fetchAllProductTypes(searchTerm || undefined));
      } catch (error) {
        toast.error("Ürün tipi silinirken hata oluştu");
      }
    }
  };

  const handleToggleActive = async (
    id: string,
    currentStatus: boolean,
    name: string
  ) => {
    try {
      await dispatch(
        updateProductType({
          id,
          data: { isActive: !currentStatus },
        })
      ).unwrap();
      toast.success(
        `${name} ürün tipi ${!currentStatus ? "aktif" : "pasif"} hale getirildi`
      );
      dispatch(fetchAllProductTypes(searchTerm || undefined));
    } catch (error) {
      toast.error("Ürün tipi durumu güncellenirken hata oluştu");
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
          <h1 className="text-3xl font-bold tracking-tight">
            Ürün Türleri Yönetimi
          </h1>
          <p className="text-muted-foreground">
            Ürün türlerini görüntüleyin, düzenleyin ve yeni türler ekleyin
          </p>
        </div>
        <Button onClick={() => router.push("/admin/product-types/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ürün Türü
        </Button>
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
            Ürün tipi bulunamadı
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Arama terimlerinizi ayarlamayı deneyin."
              : "Henüz ürün tipi bulunmuyor. İlkini oluşturun."}
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ürün Türleri</CardTitle>
            <CardDescription>
              Toplam {productTypes.length} ürün türü listeleniyor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Oluşturulma Tarihi</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productTypes.map((productType) => (
                  <TableRow key={productType.id}>
                    <TableCell className="font-medium">
                      {productType.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {productType.description}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleActive(
                            productType.id,
                            productType.isActive,
                            productType.name
                          )
                        }
                      >
                        <Badge
                          variant={
                            productType.isActive ? "default" : "secondary"
                          }
                        >
                          {productType.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {new Date(productType.createdAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/product-types/${productType.id}/edit`
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDelete(productType.id, productType.name)
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
