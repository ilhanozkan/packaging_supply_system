import { SupplierInterest } from "@/lib/features/supplierInterests/supplierInterestSlice";

export const useSupplierInterestCalculations = (
  supplierInterests: SupplierInterest[]
) => {
  const getSupplierInterestsForOrder = (orderId: string) => {
    return supplierInterests.filter(
      (interest) => interest.orderRequest?.id === orderId
    );
  };

  const getInterestedSuppliersCount = (orderId: string) => {
    return supplierInterests.filter(
      (interest) =>
        interest.orderRequest?.id === orderId && interest.isInterested
    ).length;
  };

  const getNotInterestedSuppliersCount = (orderId: string) => {
    return supplierInterests.filter(
      (interest) =>
        interest.orderRequest?.id === orderId && !interest.isInterested
    ).length;
  };

  const formatExpirationDate = (date: Date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Geçersiz tarih";
    }
  };

  return {
    getSupplierInterestsForOrder,
    getInterestedSuppliersCount,
    getNotInterestedSuppliersCount,
    formatExpirationDate,
  };
};
