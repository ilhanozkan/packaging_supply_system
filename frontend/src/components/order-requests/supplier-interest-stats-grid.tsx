import { ModalStatCard } from "./modal-stat-card";

interface SupplierInterestStatsGridProps {
  totalResponses: number;
  interestedCount: number;
  notInterestedCount: number;
}

export function SupplierInterestStatsGrid({
  totalResponses,
  interestedCount,
  notInterestedCount,
}: SupplierInterestStatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <ModalStatCard
        value={totalResponses}
        label="Toplam Yanıt"
        variant="primary"
      />
      <ModalStatCard
        value={interestedCount}
        label="İlgilenen"
        variant="success"
      />
      <ModalStatCard
        value={notInterestedCount}
        label="İlgilenmeyen"
        variant="error"
      />
    </div>
  );
}
