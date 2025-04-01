"use client"
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// Interfaces
interface CallLogEntry {
  callDate: string;
  client: string;
  clientCompany: string;
  category: string;
  rating: string;
  time: string;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  percentChange: number;
  data: any[];
  areaColor: string;
  gradientStart: string;
  gradientEnd: string;
}

// Componente de tarjeta de estadísticas individual
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
            <span className={`ml-2 px-2 py-1 text-sm rounded ${
            percentChange >= 0 
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
                <stop offset="5%" stopColor={gradientStart} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={gradientEnd} stopOpacity={0.2}/>
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

// Componente principal del dashboard
const CallStatsDashboard: React.FC = () => {
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Datos de estadísticas
  const [clientCallsData, setClientCallsData] = useState<any[]>([]);
  const [avgTimeData, setAvgTimeData] = useState<any[]>([]);
  const [positiveCallsData, setPositiveCallsData] = useState<any[]>([]);
  
  // Métricas calculadas
  const [totalCalls, setTotalCalls] = useState<number>(0);
  const [averageTime, setAverageTime] = useState<string>('0:00');
  const [positiveCalls, setPositiveCalls] = useState<number>(0);
  
  // Porcentajes de cambio (simulados - en una implementación real se calcularían)
  const [callsPercentChange, setCallsPercentChange] = useState<number>(-9.4);
  const [timePercentChange, setTimePercentChange] = useState<number>(-8.2);
  const [positivePercentChange, setPositivePercentChange] = useState<number>(4.5);

  // Fetch data from API
  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/call-logs');
        if (!response.ok) {
          throw new Error('Failed to fetch call logs');
        }
        const data = await response.json();
        setCallLogs(data);
        processData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Función simulada para generar datos de tendencia
    const generateTrendData = (count: number, min: number, max: number) => {
      return Array.from({ length: count }, (_, i) => ({
        day: i + 1,
        value: Math.floor(Math.random() * (max - min + 1)) + min
      }));
    };
    
    // Simular datos para las gráficas (en una implementación real, estos vendrían de la API)
    setClientCallsData(generateTrendData(30, 50, 100));
    setAvgTimeData(generateTrendData(30, 120, 200));
    setPositiveCallsData(generateTrendData(30, 40, 70));
    
    fetchCallLogs();
  }, []);
  
  // Procesar datos de las llamadas
  const processData = (data: CallLogEntry[]) => {
    if (data.length === 0) return;
    
    // Calcular total de llamadas
    setTotalCalls(data.length);
    
    // Calcular tiempo promedio (asumiendo que time está en minutos)
    const totalMinutes = data.reduce((acc, log) => acc + parseInt(log.time), 0);
    const avgMinutes = totalMinutes / data.length;
    const minutes = Math.floor(avgMinutes);
    const seconds = Math.round((avgMinutes - minutes) * 60);
    setAverageTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    
    // Calcular llamadas positivas
    const positive = data.filter(log => log.rating === 'Positive').length;
    setPositiveCalls(positive);
  };

  if (isLoading) {
    return <div className="w-full p-10 text-center">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="w-full p-10 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-0 w-5/6">
      <StatsCard 
        title="Client Calls" 
        value={totalCalls} 
        percentChange={callsPercentChange} 
        data={clientCallsData}
        areaColor="#6ee7b7"
        gradientStart="#6ee7b7" 
        gradientEnd="#d1fae5"
      />
      
      <StatsCard 
        title="Average Time" 
        value={averageTime} 
        percentChange={timePercentChange} 
        data={avgTimeData}
        areaColor="#f87171"
        gradientStart="#f87171" 
        gradientEnd="#fee2e2"
      />
      
      <StatsCard 
        title="Positive calls" 
        value={positiveCalls} 
        percentChange={positivePercentChange} 
        data={positiveCallsData}
        areaColor="#fbbf24"
        gradientStart="#fbbf24" 
        gradientEnd="#fef3c7"
      />
    </div>
  );
};

export default CallStatsDashboard;