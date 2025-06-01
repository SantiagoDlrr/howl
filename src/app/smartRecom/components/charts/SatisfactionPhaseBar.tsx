interface Props {
  avgSatisfaction: number;
  delta: number;
}

const levelColors = [
  "#fb7185", // rojo suave
  "#f97316", // naranja
  "#fbbf24", // amarillo
  "#10b981", // verde claro
  "#059669", // verde fuerte
];

export function SatisfactionScoreBar({ avgSatisfaction, delta }: Props) {
  const level = Math.min(Math.max(Math.round(avgSatisfaction), 1), 5);
  const isPositive = delta >= 0;
  const triangle = isPositive ? "▲" : "▼";
  const deltaColor = isPositive ? "text-green-600" : "text-red-500";

  return (
    <div className="p-5 bg-white rounded-xl shadow w-full">
      {/* Título y número */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">Calificación del Servicio</h3>
        <div className="text-right">
          <p className={`text-sm font-semibold ${deltaColor}`}>
            {triangle} {Math.abs(delta).toFixed(2)}
          </p>
          <p className="text-4xl font-extrabold text-gray-900 leading-none">
            {avgSatisfaction.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Barra de colores */}
      <div className="flex gap-2 mt-2">
        {levelColors.map((color, idx) => (
          <div
            key={idx}
            className="h-4 flex-1 rounded-md"
            style={{
              backgroundColor: color,
              opacity: idx + 1 <= level ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}