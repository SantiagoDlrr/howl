import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import type { TooltipProps } from 'recharts';


interface Props {
  ratings: number[];
}

export function SatisfactionHistogram({ ratings }: Props) {
  // Create histogram buckets (can be customized for different ranges)
  const createHistogramData = (data: number[], buckets = 5) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bucketSize = (max - min) / buckets;
    
    // For rating scales, we typically want discrete buckets
    const bucketRanges = Array.from({ length: buckets }, (_, i) => i + 1);
    
    return bucketRanges.map((bucket) => {
      const count = data.filter((rating) => {
        if (buckets === 5) {
          // For 1-5 rating scale, exact matches
          return Math.round(rating) === bucket;
        } else {
          // For other ranges, use bucket ranges
          const bucketMin = min + (bucket - 1) * bucketSize;
          const bucketMax = min + bucket * bucketSize;
          return rating >= bucketMin && rating < bucketMax;
        }
      }).length;
      
      return {
        bucket: bucket.toString(),
        count,
        range: `Rating ${bucket}`,
        percentage: data.length > 0 ? ((count / data.length) * 100).toFixed(1) : 0
      };
    });
  };

  const histogramData = createHistogramData(ratings, 5);
  const maxCount = Math.max(...histogramData.map(d => d.count));

  // Purple gradient colors from light to dark
  const colors = [
    '#E9D5FF', // Very light purple for rating 1
    '#D8B4FE', // Light purple for rating 2  
    '#C084FC', // Medium purple for rating 3
    '#A855F7', // Darker purple for rating 4
    '#9333EA', // Darkest purple for rating 5
  ];

  // Stroke colors (darker versions for outlines)
  const strokeColors = [
    '#C4B5FD', // Darker outline for rating 1
    '#B794F6', // Darker outline for rating 2
    '#9F7AEA', // Darker outline for rating 3
    '#805AD5', // Darker outline for rating 4
    '#6B46C1', // Darker outline for rating 5
  ];


const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800">{data.range}</p>
          <p className="text-sm text-purple-600 font-semibold">{`Cantidad: ${payload[0]?.value}`}</p>
          <p className="text-xs text-gray-500">{`${data.percentage}% del total`}</p>
        </div>
      );
    }
    return null;
  };
  
  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0 ? (ratings.reduce((a, b) => a + b, 0) / totalRatings).toFixed(2) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Distribución de Satisfacción</h3>
          <p className="text-sm text-gray-500 mt-1">
            Total: {totalRatings} evaluaciones | Promedio: {averageRating}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Histograma</p>
          <p className="text-xs text-gray-500">Escala 1-5</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={histogramData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barCategoryGap="10%"
          >
            {/* Grid lines in background */}
            <CartesianGrid 
              strokeDasharray="none" 
              stroke="#F3F4F6" 
              strokeWidth={1}
              horizontal={true}
              vertical={false}
            />
            
            <XAxis 
              dataKey="bucket" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: '#6B7280', fontWeight: 500 }}
              tickMargin={10}
            />
            
            <YAxis 
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, maxCount + Math.ceil(maxCount * 0.1)]}
              tickCount={6}
              width={40}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
            
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]}
              strokeWidth={2}
            >
              {histogramData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index]}
                  stroke={strokeColors[index]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Histogram statistics */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-5 gap-2 text-center">
          {histogramData.map((bucket, index) => (
            <div key={bucket.bucket} className="text-xs">
              <div 
                className="w-3 h-3 rounded-full mx-auto mb-1"
                style={{ backgroundColor: colors[index] }}
              />
              <p className="text-gray-600 font-medium">{bucket.count}</p>
              <p className="text-gray-400">{bucket.percentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}