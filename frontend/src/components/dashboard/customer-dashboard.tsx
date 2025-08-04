"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingCart, Plus, Clock } from "lucide-react";

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
  fetchMyOrderRequests,
  RequestStatus,
} from "@/lib/features/orderRequests/orderRequestSlice";
import { fetchProductTypes } from "@/lib/features/productTypes/productTypeSlice";
import { Badge } from "@/components/ui/badge";

export function CustomerDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: orderRequests, isLoading: ordersLoading } = useAppSelector(
    (state) => state.orderRequests
  );
  const { items: productTypes } = useAppSelector((state) => state.productTypes);

  useEffect(() => {
    dispatch(fetchMyOrderRequests());
    dispatch(fetchProductTypes());
  }, []);

  const activeOrders = orderRequests.filter(
    (order) => order.status === RequestStatus.ACTIVE
  );
  const completedOrders = orderRequests.filter(
    (order) => order.status === RequestStatus.COMPLETED
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Müşteri Dashboard
          </h1>
          <p className="text-muted-foreground">
            Hoş geldiniz! İşte siparişlerinizle ilgili son durum.
          </p>
        </div>
        <Button onClick={() => router.push("/order-requests/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Sipariş Talebi
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
              Tüm sipariş talepleriniz
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Siparişler
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Aktif sipariş talepleriniz
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tamamlanan Siparişler
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Başarıyla tamamlanan siparişler
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ürün Türleri</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productTypes.length}</div>
            <p className="text-xs text-muted-foreground">Mevcut ürün türleri</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Son Sipariş Talepleri</CardTitle>
          <CardDescription>
            En son sipariş talepleriniz ve durumları
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
                Hiç sipariş talebi yok
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                İlk sipariş talebinizi oluşturarak başlayın.
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push("/order-requests/new")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Sipariş Talebi
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orderRequests.slice(0, 5).map((order) => (
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
                        {order.orderItems.length} sipariş talebi oluşturuldu -{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
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
