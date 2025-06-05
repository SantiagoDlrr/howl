import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

// Updated color scheme to match the image
const COLORS: Record<string, string> = {
  "Technology": "#6366F1",        // Blue-purple
  "Customer Support": "#8B5CF6",  // Purple  
  "HR": "#A855F7",               // Purple-pink
  "Sales": "#C084FC",            // Light purple
  "Finance": "#E879F9",          // Pink-purple
  "Marketing": "#F472B6",        // Pink
  "Operations": "#FB7185",       // Pink-red
  "Other": "#FBBF24",           // Yellow-orange
};

interface DataItem {
  name: string;
  value: number;
}

interface Props {
  data: DataItem[];
  totalCalls?: number;
  title?: string;
}

export function CategoryPieChart({ 
  data, 
  totalCalls, 
  title = "Distribución por Categorías" 
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-sm">No hay datos para mostrar.</p>
        </div>
      </div>
    );
  }

  const total = totalCalls || data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages for each item
  const dataWithPercentages = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800">{data.name}</p>
          <p className="text-sm text-purple-600 font-semibold">
            {data.value} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (_: null, index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleMouseEnter = (_: any, index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Total: {total.toLocaleString()} elementos
        </p>
      </div>

      <div className="flex flex-col items-center">
        {/* Pie Chart */}
        <div className="w-full h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercentages}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                onClick={handlePieClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {dataWithPercentages.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name] || "#E2E8F0"}
                    stroke={activeIndex === index ? "#374151" : "transparent"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    style={{
                      filter: hoveredIndex === index ? "brightness(1.1)" : "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Text for Active Selection */}
        {activeIndex !== null && dataWithPercentages[activeIndex] && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-lg font-bold text-gray-900">
              {dataWithPercentages[activeIndex].name}
            </p>
            <p className="text-sm text-gray-600">
              {dataWithPercentages[activeIndex].percentage}%
            </p>
            <p className="text-xs text-gray-500">
              ({dataWithPercentages[activeIndex].value}/{total})
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {dataWithPercentages.map((entry, index) => (
            <div 
              key={entry.name} 
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activeIndex === index 
                  ? 'bg-gray-50 shadow-sm' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handlePieClick(null, index)}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[entry.name] || "#E2E8F0" }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-sm text-gray-800 font-medium truncate block">
                  {entry.name}
                </span>
                <span className="text-xs text-gray-500">
                  {entry.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}