"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Clock } from "lucide-react";

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
import { fetchMySupplierInterests } from "@/lib/features/supplierInterests/supplierInterestSlice";
import { Badge } from "@/components/ui/badge";

export function SupplierDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: orderRequests, isLoading: ordersLoading } = useAppSelector(
    (state) => state.orderRequests
  );
  const { myInterests, isLoading: interestsLoading } = useAppSelector(
    (state) => state.supplierInterests
  );

  useEffect(() => {
    dispatch(fetchOrderRequests(undefined));
    dispatch(fetchMySupplierInterests());
  }, []);

  const activeOrders = orderRequests.filter(
    (order) => order.status === RequestStatus.ACTIVE
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tedarikçi Dashboard
          </h1>
          <p className="text-muted-foreground">
            Hoş geldiniz! İşte müşterilerden gelen en son sipariş talepleri.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mevcut Siparişler
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Toplam sipariş talebi
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
            <p className="text-xs text-muted-foreground">Aktif siparişler</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              İlgilendiğim Siparişler
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myInterests.length}</div>
            <p className="text-xs text-muted-foreground">
              İlgilendiğim siparişler
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Sipariş Talepleri</CardTitle>
          <CardDescription>
            Tedarikçi arayan müşterilerden gelen en son sipariş talepleri
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
                Müşterilerden gelen yeni sipariş talepleri için daha sonra
                kontrol edin.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderRequests.slice(0, 5).map((order) => {
                const hasInterest = myInterests.find(
                  (interest) => interest.orderRequestId === order.id
                );
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/order-requests`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{order.title}</p>
                        <p className="text-sm text-gray-500">
                          {order.orderItems.length} ürün türü •{" "}
                          {order.customer?.companyName ||
                            `${order.customer?.firstName} ${order.customer?.lastName}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          Son Başvuru Tarihi:{" "}
                          {new Date(order.expirationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {hasInterest && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          <Heart className="w-3 h-3 mr-1 fill-current" />
                          İlgilendim
                        </Badge>
                      )}
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İlgilendiğim Siparişler</CardTitle>
          <CardDescription>İlgilendiğiniz sipariş talepleri</CardDescription>
        </CardHeader>
        <CardContent>
          {interestsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : myInterests.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Hiç ilgilendiğiniz sipariş yok
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Sipariş taleplerini görüntüleyin ve taleplerle ilgilenin.
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push("/order-requests")}>
                  Sipariş Taleplerini Görüntüle
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {myInterests.slice(0, 5).map((interest) => (
                <div
                  key={interest.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/order-requests`)}
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">
                        {interest.orderRequest?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        İlgilendiğiniz tarih{" "}
                        {new Date(interest.createdAt).toLocaleDateString()}
                      </p>
                      {interest.offerPrice && (
                        <p className="text-sm text-green-600 font-medium">
                          Teklif: ${interest.offerPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={interest.isInterested ? "default" : "secondary"}
                    >
                      {interest.isInterested ? "İlgilendim" : "İlgilenmedim"}
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
