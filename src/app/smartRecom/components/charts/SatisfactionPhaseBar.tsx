interface Props {
  avgSatisfaction: number;
  delta: number;
  prev: number;
}

const levelColors = [
  "#ff6b8a", // rojo suave más brillante
  "#ff8534", // naranja más brillante
  "#ffd700", // amarillo más brillante
  "#00d99a", // verde claro más brillante
  "#00b377", // verde fuerte más brillante
];

export function SatisfactionScoreBar({ avgSatisfaction, delta, prev }: Props) {
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
    return `${sign}${deltaValue.toFixed(2)}`;
  };

  // Calculate fill percentage for each rectangle based on decimal values
  const getRectangleFill = (rectIndex: number) => {
    const rectStart = rectIndex; // 0, 1, 2, 3, 4 representing 1, 2, 3, 4, 5
    const rectEnd = rectIndex + 1;
    
    if (avgSatisfaction <= rectStart) {
      return 0; // Not filled at all
    } else if (avgSatisfaction >= rectEnd) {
      return 1; // Fully filled
    } else {
      return avgSatisfaction - rectStart; // Partially filled
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md p-5 w-full relative">
      {/* Delta badge - positioned absolutely in top right */}
      <div className="absolute top-3 right-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getDeltaStyle(delta)}`}>
          {formatDelta(delta)}
        </span>
      </div>

      {/* Main content - two containers */}
      <div className="flex justify-between items-start mb-5">
        {/* Left container: Title and gray text */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Satisfacción Promedio</h3>
          <div className="text-sm text-gray-500 font-medium">
            {prev >= 0 ? '+' : ''}{prev.toFixed(1)} vs período anterior
          </div>
        </div>
        
        {/* Right container: Big number */}
        <div className="text-right">
          <div className="text-4xl font-black text-gray-900 leading-tight mt-3">
            {avgSatisfaction.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Color bar - with decimal precision */}
      <div className="flex gap-2">
        {levelColors.map((color, idx) => {
          const fillPercentage = getRectangleFill(idx);
          return (
            <div key={idx} className="h-5 flex-1 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-400 ease-out"
                style={{
                  backgroundColor: color,
                  width: `${fillPercentage * 100}%`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}