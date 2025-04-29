import type { TrendData } from '@/app/utils/types/logs';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
  title: string;
  value: string | number;
  percentChange: number;
  data: TrendData[];
  areaColor: string;
  gradientStart: string;
  gradientEnd: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  percentChange,
  data,
  areaColor,
  gradientStart,
  gradientEnd
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-row h-full">
      <div className="flex flex-col justify-between mr-5">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">From last month</p>
        </div>

        <div className="flex flex-col items-baseline mb-4">
          <span className="text-5xl font-bold text-gray-900">{value}</span>
          <span className={`ml-2 px-2 py-1 text-sm rounded ${percentChange >= 0
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}>
            {percentChange >= 0 ? '+' : ''}{percentChange}%
          </span>
        </div>
      </div>

      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%" minHeight={80}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientStart} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientEnd} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={areaColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsCard;