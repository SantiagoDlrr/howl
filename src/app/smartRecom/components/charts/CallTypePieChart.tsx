import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";

const COLORS: Record<string, string> = {
  "Sales": "#FD836F",
  "Technology": "#4DABF7",
  "HR": "#FFD166",
  "Customer Support": "#38BDF8",
  "Finance": "#C084FC",
  "Marketing": "#4ADE80",
  "Operations": "#D946EF",
  "Other": "#94A3B8",
};

export function CallTypePie({ data, totalCalls }: { data: { name: string; value: number }[]; totalCalls: number }) {
  const [activeIndex, setActiveIndex] = useState(0);

   if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm">No hay datos para mostrar.</p>;
  }

  const active = data[activeIndex];
  const percent = ((active!.value / totalCalls) * 100).toFixed(0);

  return (
    <div className="w-full h-96 flex items-center justify-between gap-6">
      <div className="w-1/2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              onClick={(_, i) => setActiveIndex(i)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#E2E8F0"}
                  cursor="pointer"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center -mt-20">
          <p className="text-lg font-bold text-gray-900">{active!.name}</p>
          <p className="text-sm text-gray-600">{percent}% ({active!.value}/{totalCalls})</p>
        </div>
      </div>
      <div className="w-1/2 grid grid-cols-2 gap-y-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[entry.name] || "#E2E8F0" }}
            />
            <span className="text-sm text-gray-800">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
