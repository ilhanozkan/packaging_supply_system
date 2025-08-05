import { StatCard } from "./stat-card";

interface SupplierResponseStatsProps {
  totalResponses: number;
  interestedCount: number;
  notInterestedCount: number;
}

export function SupplierResponseStats({
  totalResponses,
  interestedCount,
  notInterestedCount,
}: SupplierResponseStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <StatCard value={totalResponses} label="Toplam" variant="default" />
      <StatCard value={interestedCount} label="İlgilenen" variant="success" />
      <StatCard value={notInterestedCount} label="Ret" variant="error" />
    </div>
  );
}
