interface Props {
  label: string;
  value: string | number;
  delta?: number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, delta, icon }: Props) {
  const isPositive = typeof delta === "number" && delta >= 0;
  const deltaColor = isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
  const arrow = isPositive ? "↑" : "↓";

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-500">{icon}</div>}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      </div>

      {/* Value + Delta */}
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {typeof delta === "number" ? (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${deltaColor}`}>
            {Math.abs(delta).toFixed(1)}% {arrow}
          </span>
        ) : (
          <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded">
            Nuevo
          </span>
        )}
      </div>
    </div>
  );
}