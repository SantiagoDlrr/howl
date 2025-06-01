import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  ratings: number[];
}

export function SatisfactionHistogram({ ratings }: Props) {
  const buckets = [1, 2, 3, 4, 5];
  const counts = buckets.map((rating) => ({
    rating,
    count: ratings.filter((r) => r === rating).length,
  }));

  return (
    <div className="w-full h-64">
      <h3 className="text-md font-semibold mb-2">Distribución de satisfacción</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={counts}>
          <XAxis dataKey="rating" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}