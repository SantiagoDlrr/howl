import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState, useMemo, useEffect } from "react";

// Paleta balanceada + gradientes suaves
const SENTIMENT_COLORS = {
  positive: "#22c55e", // Verde más puro y brillante
  neutral: "#facc15",  // Amarillo brillante
  negative: "#f43f5e", // Rojo fuerte
};

const SENTIMENT_COLORS_DARK = {
  positive: "#16a34a", // Verde oscuro
  neutral: "#eab308",
  negative: "#e11d48",
};

export function SentimentGauge({ sentiments }: {
  sentiments: Record<"positive" | "neutral" | "negative", number>;
}) {
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);

  const data = [
    { name: "positive", value: sentiments.positive, label: "Positivo" },
    { name: "neutral", value: sentiments.neutral, label: "Neutral" },
    { name: "negative", value: sentiments.negative, label: "Negativo" },
  ];

  const total = data.reduce((acc, d) => acc + d.value, 0);

  const { displayPercentage, displayLabel } = useMemo(() => {
    if (selectedSentiment) {
      const selected = data.find(item => item.name === selectedSentiment);
      if (selected) {
        return {
          displayPercentage: total > 0 ? Math.round((selected.value / total) * 100) : 0,
          displayLabel: selected.label,
        };
      }
    }
    const dominant = data.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );
    return {
      displayPercentage: total > 0 ? Math.round((dominant.value / total) * 100) : 0,
      displayLabel: dominant.label,
    };
  }, [selectedSentiment, data, total]);

  const [animatedPercentage, setAnimatedPercentage] = useState(displayPercentage);

  useEffect(() => {
    let frame: number;
    const step = () => {
      setAnimatedPercentage((prev) => {
        if (prev === displayPercentage) return prev;
        const delta = Math.abs(displayPercentage - prev);
        const increment = Math.ceil(delta / 10);
        if (prev < displayPercentage) {
          return Math.min(prev + increment, displayPercentage);
        } else {
          return Math.max(prev - increment, displayPercentage);
        }
      });
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [displayPercentage]);

  const handleSentimentClick = (sentimentName: string) => {
    setSelectedSentiment((prev) =>
      prev === sentimentName ? null : sentimentName
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4 text-center">
        Análisis de Sentimientos
      </h3>

      {/* Panel principal: Gauge + Porcentaje */}
      <div className="flex flex-row justify-center items-center gap-6">
        <div className="w-48 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((entry) => (
                  <linearGradient key={entry.name} id={`gradient-${entry.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS]} />
                    <stop offset="100%" stopColor={SENTIMENT_COLORS_DARK[entry.name as keyof typeof SENTIMENT_COLORS_DARK]} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="85%"
                startAngle={180}
                endAngle={0}
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                stroke="none"
                cornerRadius={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${entry.name})`}
                    style={{
                      opacity: selectedSentiment && selectedSentiment !== entry.name ? 0.4 : 1,
                      transition: 'opacity 0.2s ease'
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Porcentaje con gradiente */}
        <div className="text-center">
          <div
            className="text-5xl font-extrabold leading-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: selectedSentiment
                ? `linear-gradient(to right, ${SENTIMENT_COLORS[selectedSentiment as keyof typeof SENTIMENT_COLORS]}, ${SENTIMENT_COLORS_DARK[selectedSentiment as keyof typeof SENTIMENT_COLORS_DARK]})`
                : 'none',
              color: selectedSentiment ? undefined : '#1f2937'
            }}
          >
            {animatedPercentage}%
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Sentimiento {displayLabel}
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex justify-center gap-4 mt-5">
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          const isSelected = selectedSentiment === item.name;

          return (
            <button
              key={item.name}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 hover:bg-gray-100 ${
                isSelected ? 'bg-gray-200 ring-1 ring-gray-400' : ''
              }`}
              onClick={() => handleSentimentClick(item.name)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: SENTIMENT_COLORS[item.name as keyof typeof SENTIMENT_COLORS],
                }}
              />
              <div className="flex flex-col leading-none">
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  ({percentage}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-gray-400 mt-2 text-center">
        {selectedSentiment
          ? "Haz clic nuevamente para mostrar el sentimiento dominante"
          : "Haz clic en cualquier sentimiento para ver su porcentaje"}
      </div>
    </div>
  );
}