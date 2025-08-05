interface ModalStatCardProps {
  value: number;
  label: string;
  variant: "primary" | "success" | "error";
}

export function ModalStatCard({ value, label, variant }: ModalStatCardProps) {
  const variantStyles = {
    primary: "bg-blue-50 text-blue-600",
    success: "bg-green-50 text-green-600",
    error: "bg-red-50 text-red-600",
  };

  const colorClass = variantStyles[variant];

  return (
    <div className={`${colorClass} rounded-lg p-4 text-center`}>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      <div className={`text-sm ${colorClass}`}>{label}</div>
    </div>
  );
}
