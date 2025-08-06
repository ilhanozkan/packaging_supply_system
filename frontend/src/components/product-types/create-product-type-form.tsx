"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/lib/hooks";
import { createProductType } from "@/lib/features/productTypes/productTypeSlice";

export function CreateProductTypeForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Ürün tipi adı gereklidir");

    if (!formData.description.trim())
      return toast.error("Ürün tipi açıklaması gereklidir");

    setIsSubmitting(true);

    try {
      await dispatch(
        createProductType({
          name: formData.name.trim(),
          description: formData.description.trim(),
          imageUrl: formData.imageUrl.trim() || undefined,
          isActive: formData.isActive,
        })
      ).unwrap();

      toast.success("Ürün tipi başarıyla oluşturuldu");
      router.push("/admin/product-types");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ürün tipi oluşturulurken hata oluştu";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/product-types")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Yeni Ürün Türü Oluştur
          </h1>
          <p className="text-muted-foreground">
            Müşterilerin sipariş taleplerinde kullanabilecekleri yeni bir ürün
            türü ekleyin
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Ürün Türü Bilgileri
          </CardTitle>
          <CardDescription>
            Ürün türü için gerekli bilgileri doldurun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Türü Adı *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Örn: Karton Kutu, Plastik Ambalaj, vb."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama *</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ürün türü hakkında detaylı açıklama yazın..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Görsel URL (İsteğe Bağlı)</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Ürün türünü temsil eden bir görsel URL&apos;si ekleyebilirsiniz
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <Label htmlFor="isActive">Aktif olarak oluştur</Label>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Oluşturuluyor..." : "Ürün Türünü Oluştur"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/product-types")}
                disabled={isSubmitting}
              >
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {formData.imageUrl && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Görsel Önizleme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img
                src={formData.imageUrl}
                alt="Ürün türü görseli"
                className="max-w-full max-h-64 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML =
                    '<p class="text-red-500 text-sm">Görsel yüklenemedi. URL\'yi kontrol edin.</p>';
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
