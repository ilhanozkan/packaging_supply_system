"use client";

import { useState } from "react";

import { Pagination } from "@/components/ui/pagination";
import { OrderItemsModal } from "@/components/order-requests/order-items-modal";
import { OrderRequest } from "@/lib/features/orderRequests/orderRequestSlice";
import { SupplierInterest } from "@/lib/features/supplierInterests/supplierInterestSlice";

import { AdminSupplierInterestsModal } from "./admin-supplier-interests-modal";
import {
  LoadingSkeletonGrid,
  EmptyOrdersState,
} from "./loading-and-empty-states";
import { OrderRequestCard } from "./order-request-card";
import { useSupplierInterestCalculations } from "./use-supplier-interest-calculations";

interface AdminOrderRequestsListProps {
  orderRequests: OrderRequest[];
  supplierInterests: SupplierInterest[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 6;

export function AdminOrderRequestsList({
  orderRequests,
  supplierInterests,
  isLoading,
}: AdminOrderRequestsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderForModal, setSelectedOrderForModal] =
    useState<OrderRequest | null>(null);
  const [selectedOrderForInterests, setSelectedOrderForInterests] =
    useState<OrderRequest | null>(null);

  const {
    getSupplierInterestsForOrder,
    getInterestedSuppliersCount,
    getNotInterestedSuppliersCount,
    formatExpirationDate,
  } = useSupplierInterestCalculations(supplierInterests);

  if (isLoading) return <LoadingSkeletonGrid />;
  if (orderRequests.length === 0) return <EmptyOrdersState />;

  const totalPages = Math.ceil(orderRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = orderRequests.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tüm Sipariş Talepleri</h1>
          <p className="text-gray-600">
            Sistemdeki tüm sipariş talepleri ve tedarikçi ilgi durumları
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentOrders.map((order) => {
          const interestedCount = getInterestedSuppliersCount(order.id);
          const notInterestedCount = getNotInterestedSuppliersCount(order.id);
          const totalSupplierResponses = interestedCount + notInterestedCount;

          return (
            <OrderRequestCard
              key={order.id}
              order={order}
              interestedCount={interestedCount}
              notInterestedCount={notInterestedCount}
              totalSupplierResponses={totalSupplierResponses}
              onShowOrderItems={setSelectedOrderForModal}
              onShowInterests={setSelectedOrderForInterests}
              formatExpirationDate={formatExpirationDate}
            />
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <OrderItemsModal
        isOpen={!!selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
        orderRequest={selectedOrderForModal}
      />

      <AdminSupplierInterestsModal
        isOpen={!!selectedOrderForInterests}
        onClose={() => setSelectedOrderForInterests(null)}
        orderRequest={selectedOrderForInterests}
        supplierInterests={
          selectedOrderForInterests
            ? getSupplierInterestsForOrder(selectedOrderForInterests.id)
            : []
        }
      />
    </div>
  );
}
