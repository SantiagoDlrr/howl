// smartFeatures/components/charts/SentimentGauge.tsx
import { PieChart, Pie, Cell } from "recharts";

const COLORS = {
  positive: "#22c55e",
  neutral: "#facc15",
  negative: "#ef4444",
};

export function SentimentGauge({ sentiments }: {
  sentiments: Record<"positive" | "neutral" | "negative", number>;
}) {
  const data = [
    { name: "Positive", value: sentiments.positive },
    { name: "Neutral", value: sentiments.neutral },
    { name: "Negative", value: sentiments.negative },
  ];
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="w-full">
      <PieChart width={300} height={150}>
        <Pie
          data={data}
          cx={150}
          cy={150}
          startAngle={180}
          endAngle={0}
          innerRadius={70}
          outerRadius={100}
          dataKey="value"
          onClick={(entry) => alert(`${entry.name}: ${entry.value} llamadas`)}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
          ))}
        </Pie>
      </PieChart>
      <p className="text-center text-xl font-bold mt-2">{total} llamadas</p>
    </div>
  );
}