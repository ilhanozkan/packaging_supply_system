interface StatCardProps {
  value: number;
  label: string;
  variant: "default" | "success" | "error";
}

export function StatCard({ value, label, variant }: StatCardProps) {
  const variantStyles = {
    default: "bg-slate-700/50",
    success: "bg-green-900/30 border border-green-700/50",
    error: "bg-red-900/30 border border-red-700/50",
  };

  const textStyles = {
    default: { value: "text-white", label: "text-gray-400" },
    success: { value: "text-green-300", label: "text-green-400" },
    error: { value: "text-red-300", label: "text-red-400" },
  };

  return (
    <div className={`${variantStyles[variant]} rounded-md py-2`}>
      <div className={`${textStyles[variant].value} font-semibold text-sm`}>
        {value}
      </div>
      <div className={`${textStyles[variant].label} text-xs`}>{label}</div>
    </div>
  );
}
