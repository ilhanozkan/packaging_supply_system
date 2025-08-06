"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/hooks";
import {
  updateSupplierInterest,
  SupplierInterest,
} from "@/lib/features/supplierInterests/supplierInterestSlice";

const editOfferSchema = z.object({
  offerPrice: z.number().min(0.01, "Teklif fiyatı 0'dan büyük olmalıdır"),
});

type EditOfferFormData = z.infer<typeof editOfferSchema>;

interface EditOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  interest: SupplierInterest | null;
}

export function EditOfferDialog({
  isOpen,
  onClose,
  interest,
}: EditOfferDialogProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditOfferFormData>({
    resolver: zodResolver(editOfferSchema),
    defaultValues: {
      offerPrice: 0,
    },
  });

  useEffect(() => {
    if (interest && isOpen) {
      form.reset({
        offerPrice: interest.offerPrice || 0,
      });
    }
  }, [interest, isOpen, form]);

  const onSubmit = async (data: EditOfferFormData) => {
    if (!interest) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        updateSupplierInterest({
          id: interest.id,
          data: {
            offerPrice: data.offerPrice,
          },
        })
      ).unwrap();

      toast.success("Teklifiniz başarıyla güncellendi!");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Teklif güncellenirken bir hata oluştu";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      form.reset();
    }
  };

  if (!interest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Teklifi Düzenle</DialogTitle>
          <DialogDescription>
            &quot;{interest.orderRequest?.title}&quot; sipariş talebi için
            teklifinizi güncelleyin.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <strong>Mevcut Teklif:</strong>{" "}
                {interest.offerPrice
                  ? new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(interest.offerPrice)
                  : "Belirtilmemiş"}
              </div>
            </div>

            <FormField
              control={form.control}
              name="offerPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yeni Teklif Fiyatı (₺)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="250.50"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Güncelleniyor..." : "Teklifi Güncelle"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
