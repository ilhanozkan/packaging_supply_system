"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createOrderRequest } from "@/lib/features/orderRequests/orderRequestSlice";
import { fetchProductTypes } from "@/lib/features/productTypes/productTypeSlice";
import type { ProductType } from "@/lib/features/productTypes/productTypeSlice";

const createOrderRequestSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
  expirationDate: z.string().min(1, "Son tarih gereklidir"),
  orderItems: z
    .array(
      z.object({
        productTypeId: z.string().min(1, "Ürün tipi gereklidir"),
        requestedQuantity: z.number().min(1, "Miktar en az 1 olmalıdır"),
      })
    )
    .min(1, "En az bir ürün seçmelisiniz"),
});

type CreateOrderRequestFormValues = z.infer<typeof createOrderRequestSchema>;

interface SelectedProduct {
  productType: ProductType;
  quantity: number;
}

export function CreateOrderRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.orderRequests);
  const { items: productTypes, isLoading: loadingProducts } = useAppSelector(
    (state) => state.productTypes
  );

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<CreateOrderRequestFormValues>({
    resolver: zodResolver(createOrderRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      expirationDate: "",
      orderItems: [],
    },
  });

  useEffect(() => {
    dispatch(fetchProductTypes());
  }, []);

  useEffect(() => {
    const productTypeId = searchParams.get("productType");

    if (productTypeId && productTypes.length > 0) {
      const productType = productTypes.find((p) => p.id === productTypeId);

      if (productType && productType.isActive) {
        const isAlreadySelected = selectedProducts.some(
          (selected) => selected.productType.id === productTypeId
        );

        if (!isAlreadySelected)
          setSelectedProducts((prev) => [
            ...prev,
            {
              productType: productType,
              quantity: 1,
            },
          ]);
      }
    }
  }, [searchParams, productTypes, selectedProducts]);

  useEffect(() => {
    const orderItems = selectedProducts.map((item) => ({
      productTypeId: item.productType.id,
      requestedQuantity: item.quantity,
    }));
    form.setValue("orderItems", orderItems);
  }, [selectedProducts, form]);

  const filteredProducts = productTypes.filter(
    (product) =>
      product.isActive &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedProducts.some(
        (selected) => selected.productType.id === product.id
      )
  );

  const handleProductSelect = (product: ProductType) => {
    setSelectedProducts((prev) => [
      ...prev,
      {
        productType: product,
        quantity: 1,
      },
    ]);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: CreateOrderRequestFormValues) => {
    try {
      const result = await dispatch(createOrderRequest(values));
      if (createOrderRequest.fulfilled.match(result)) {
        toast.success("Talep başarıyla oluşturuldu!");
        router.push("/dashboard");
      } else {
        toast.error((result.payload as string) || "Talep oluşturulamadı");
      }
    } catch (error) {
      toast.error("Talep oluşturulurken bir hata oluştu");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                Talep Oluştur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Başlık</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="bg-white rounded-lg border-0 h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Açıklama</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder=""
                        className="w-full min-h-[120px] px-3 py-3 bg-white rounded-lg border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-white block mb-4">Ürünler</FormLabel>

                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Ürün ara"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white rounded-lg border-0 h-12"
                  />
                </div>

                {loadingProducts ? (
                  <div className="text-center py-8">
                    <p className="text-white">Ürünler yükleniyor...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 max-h-[400px] overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="relative bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
                      >
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-400 text-xs text-center">
                                Görsel Yok
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-center">
                          <h3 className="font-medium text-sm text-gray-900 mb-2 overflow-hidden text-ellipsis line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              className="w-6 h-6 bg-button-primary hover:bg-button-primary-hover text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedProducts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-white">
                      Seçilen Ürünler
                    </h3>
                    <div className="space-y-3">
                      {selectedProducts.map((item, index) => (
                        <div
                          key={item.productType.id}
                          className="flex items-center gap-4 p-4 bg-slate-600 rounded-lg"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.productType.imageUrl ? (
                              <img
                                src={item.productType.imageUrl}
                                alt={item.productType.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400 text-xs">
                                  Görsel Yok
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-medium text-white">
                              {item.productType.name}
                            </h4>
                            <p className="text-sm text-gray-300">
                              {item.productType.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(index, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="bg-white text-gray-900"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                handleQuantityChange(index, Math.max(1, value));
                              }}
                              min="1"
                              className="w-28 text-center bg-white text-gray-900 border-0 h-8"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(index, item.quantity + 1)
                              }
                              className="bg-white text-gray-900"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            Kaldır
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {form.formState.errors.orderItems && (
                  <p className="text-red-400 text-sm mt-2">
                    {form.formState.errors.orderItems.message}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Son Tarih</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={today}
                        {...field}
                        className="bg-white rounded-lg border-0 h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || selectedProducts.length === 0}
                  className="bg-button-primary hover:bg-button-primary-hover text-white px-12 py-3 rounded-lg text-lg font-medium w-full max-w-xs"
                >
                  {isLoading ? "Oluşturuluyor..." : "Oluştur"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
