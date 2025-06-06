interface Props {
  label: string;
  value: string | number;
  delta?: number;
  icon?: React.ReactNode;
  prev: number | string;
}

export function StatCard({ label, value, delta, icon, prev }: Props) {
  const getDeltaStyle = (deltaValue: number) => {
    if (deltaValue > 0) {
      return "bg-green-100 text-green-700"; // Positive values
    } else if (deltaValue < 0) {
      return "bg-red-100 text-red-600"; // Negative values
    } else {
      return "bg-blue-100 text-blue-600"; // Zero values
    }
  };

  const formatDelta = (deltaValue: number) => {
    const sign = deltaValue >= 0 ? "+" : "";
    return `${sign}${deltaValue.toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full relative">
      {/* Delta badge - positioned absolutely in top right */}
      <div className="absolute top-4 right-4">
        {typeof delta === "number" ? (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getDeltaStyle(delta)}`}>
            {formatDelta(delta)}
          </span>
        ) : (
          <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md">
            Nuevo
          </span>
        )}
      </div>

      {/* Header with icon and label */}
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-gray-500 text-base">{icon}</div>}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>

      {/* Main value */}
      <div className="mb-2">
        <div className="text-3xl font-bold leading-tight" >
          {value}
        </div>
      </div>

      {/* Previous period comparison */}
      <div className="text-sm text-gray-400">
        {prev} vs período anterior
      </div>
    </div>
  );
}