"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingCart, Users, Heart, Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchOrderRequests,
  RequestStatus,
} from "@/lib/features/orderRequests/orderRequestSlice";
import { fetchAllProductTypes } from "@/lib/features/productTypes/productTypeSlice";
import { fetchAllSupplierInterests } from "@/lib/features/supplierInterests/supplierInterestSlice";
import { Badge } from "@/components/ui/badge";

export function AdminDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: orderRequests, isLoading: ordersLoading } = useAppSelector(
    (state) => state.orderRequests
  );
  const { items: productTypes } = useAppSelector((state) => state.productTypes);
  const { items: supplierInterests } = useAppSelector(
    (state) => state.supplierInterests
  );

  useEffect(() => {
    dispatch(fetchOrderRequests(undefined));
    dispatch(fetchAllProductTypes(undefined));
    dispatch(fetchAllSupplierInterests());
  }, []);

  const pendingOrders = orderRequests.filter(
    (order) => order.status === RequestStatus.ACTIVE
  );
  const activeProductTypes = productTypes.filter((product) => product.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Hoş geldiniz! İşte sistem genelindeki istatistikler ve yönetim
            araçları.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/product-types/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ürün Türü
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Siparişler
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Tüm sipariş talepleri
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Ürün Türleri
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeProductTypes.length}
            </div>
            <p className="text-xs text-muted-foreground">Aktif ürün türleri</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bekleyen Siparişler
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Bekleyen tedarikçi yanıtları
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tedarikçilerin İlgilendikleri
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplierInterests.length}</div>
            <p className="text-xs text-muted-foreground">
              Toplam ilgi gösterilen sipariş
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kullanıcı Yönetimi</CardTitle>
            <CardDescription>
              Müşterileri, tedarikçileri ve yöneticileri yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/admin/users")}
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Kullanıcıları Yönet
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ürün Türleri</CardTitle>
            <CardDescription>
              Siparişler için mevcut ürün türlerini oluşturun ve yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/admin/product-types")}
              variant="outline"
            >
              <Package className="w-4 h-4 mr-2" />
              Ürünleri Yönet
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sipariş Talepleri</CardTitle>
            <CardDescription>
              Sistemdeki tüm sipariş taleplerini izleyin ve yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/admin/order-requests")}
              variant="outline"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Siparişleri Yönet
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Son Sipariş Talepleri</CardTitle>
          <CardDescription>
            En son sipariş talepleri ve durumları
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : orderRequests.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Henüz sipariş yok
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Siparişler, müşteriler oluşturdukça burada görünecektir.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderRequests
                .toSorted(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      router.push(`/order-requests/${order.id}/offers`)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{order.title}</p>
                        <p className="text-sm text-gray-500">
                          {order.orderItems.length} item(s) •{" "}
                          {order.customer?.companyName ||
                            `${order.customer?.firstName} ${order.customer?.lastName}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          Oluşturulma Tarihi:{" "}
                          {new Date(order.createdAt).toLocaleDateString()} • Son
                          Tarih:{" "}
                          {new Date(order.expirationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          order.status === RequestStatus.COMPLETED
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1).replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
