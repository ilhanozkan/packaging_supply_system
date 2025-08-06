"use client";

import { useState } from "react";
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
import { createSupplierInterest } from "@/lib/features/supplierInterests/supplierInterestSlice";

const supplierInterestSchema = z.object({
  offerPrice: z.number().min(0.01, "Teklif fiyatı 0'dan büyük olmalıdır"),
});

type SupplierInterestFormData = z.infer<typeof supplierInterestSchema>;

interface SupplierInterestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderRequestId: string;
  orderTitle: string;
  isInterested: boolean;
}

export function SupplierInterestDialog({
  isOpen,
  onClose,
  orderRequestId,
  orderTitle,
  isInterested,
}: SupplierInterestDialogProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupplierInterestFormData>({
    resolver: zodResolver(supplierInterestSchema),
    defaultValues: {
      offerPrice: 0,
    },
  });

  const onSubmit = async (data: SupplierInterestFormData) => {
    setIsSubmitting(true);
    try {
      const supplierInterestData = {
        orderRequestId,
        isInterested,
        offerPrice: isInterested ? data.offerPrice : undefined,
      };

      await dispatch(createSupplierInterest(supplierInterestData)).unwrap();

      toast.success(
        isInterested
          ? "Teklifiniz başarıyla gönderildi!"
          : "İlgilenmediğiniz başarıyla kaydedildi!"
      );
      onClose();
      form.reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Bir hata oluştu";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotInterestedSubmit = async () => {
    setIsSubmitting(true);
    try {
      const supplierInterestData = {
        orderRequestId,
        isInterested: false,
      };

      await dispatch(createSupplierInterest(supplierInterestData)).unwrap();

      toast.success("İlgilenmediğiniz başarıyla kaydedildi!");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Bir hata oluştu";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isInterested ? "Teklif Ver" : "İlgi Durumu"}
          </DialogTitle>
          <DialogDescription>
            {isInterested
              ? `"${orderTitle}" sipariş talebi için teklifinizi giriniz.`
              : `"${orderTitle}" sipariş talebi için ilgi durumunuzu belirtiniz.`}
          </DialogDescription>
        </DialogHeader>

        {isInterested ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="offerPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teklif Fiyatı (₺)</FormLabel>
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
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Gönderiliyor..." : "Teklif Gönder"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Bu sipariş talebi ile ilgilenmediğinizi onaylıyor musunuz?
            </p>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button
                onClick={handleNotInterestedSubmit}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Kaydediliyor..." : "İlgilenmiyorum"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
