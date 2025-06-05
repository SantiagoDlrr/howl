'use client';

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { SentimentGauge } from "@/app/smartRecom/components/charts/SentimentGauge";
import { SatisfactionHistogram } from "@/app/smartRecom/components/charts/SatisfactionHistogram";
import { SatisfactionScoreBar } from "@/app/smartRecom/components/charts/SatisfactionPhaseBar";
import { StatCard } from "@/app/smartRecom/components/charts/StatCard";
import { PhoneCall, Clock, TimerReset, GripVertical } from "lucide-react";
import { CategoryPieChart } from "@/app/smartRecom/components/charts/CallTypePieChart";
import { TopClientsTable } from "@/app/smartRecom/components/charts/TopClientsTable";

function safeDelta(current: number, previous: number): number | undefined {
  if (!previous || previous === 0) return undefined;
  return ((current - previous) / previous) * 100;
}

function formatMinutes(value: number): string {
  if (value >= 60) {
    return (value / 60).toFixed(1) + " h";
  }
  return value.toFixed(1) + " min";
}

export default function SmartFeedbackPage() {
  const [interval, setInterval] = useState<"dia" | "semana" | "mes">("dia");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const consultantId = 77;

  const { data: metrics } = api.feedbackManager.getFeedbackMetrics.useQuery(
    { consultantId, interval },
    { enabled: !!consultantId }
  );

  const summaryMutation = api.feedbackManager.generateAISummary.useMutation();

  useEffect(() => {
    if (!metrics) return;

    summaryMutation.mutate(
      { metrics, interval },
      {
        onSuccess: (res) => {
          setAiSummary(res.summary);
        },
        onError: (err) => {
          console.error("❌ Error generando resumen con IA:", err);
        },
      }
    );
  }, [metrics?.current.total_calls, interval]);

  // Handle panel resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth >= 30 && newWidth <= 80) {
      setLeftPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  console.log("🔍 Top Clients:", metrics?.topClients);

  return (
    <div className="flex w-full pt-16 h-[calc(100vh-4rem)]">
      {/* LEFT PANEL - Resizable */}
      <div 
        className="p-6 bg-gray-50 overflow-y-auto"
        style={{ width: `${leftPanelWidth}%` }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard de Rendimiento</h1>
          <p className="text-gray-600">Resumen de métricas y análisis</p>
        </div>

        {/* Stats Cards Row */}
        {metrics && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Llamadas Totales"
              value={metrics.current.total_calls}
              delta={safeDelta(metrics.current.total_calls, metrics.previous.total_calls)}
              icon={<PhoneCall className="w-4 h-4" />}
              prev={metrics.current.total_calls - metrics.previous.total_calls}
            />
            <StatCard
              label="Duración Promedio"
              value={formatMinutes(metrics.current.avg_duration / 60)}
              delta={safeDelta(metrics.current.avg_duration, metrics.previous.avg_duration)}
              icon={<Clock className="w-4 h-4" />}
              prev={formatMinutes((metrics.current.avg_duration / 60) - (metrics.previous.avg_duration / 60))}
            />
            <StatCard
              label="Duración Total"
              value={formatMinutes(metrics.current.total_duration / 60)}
              delta={safeDelta(metrics.current.total_duration, metrics.previous.total_duration)}
              icon={<TimerReset className="w-4 h-4" />}
              prev={formatMinutes((metrics.current.total_duration / 60)- (metrics.previous.total_duration / 60))}
            />
          </div>
        )}

        {/* Satisfaction Score Bar - Full Width Row */}
        <div className="mb-8">
          <SatisfactionScoreBar 
            avgSatisfaction={metrics?.current?.avg_satisfaction || 0}
            delta={metrics?.deltas?.avg_satisfaction || 0}
            prev={(metrics?.current?.avg_satisfaction || 0) - (metrics?.previous?.avg_satisfaction || 0)}
          />
        </div>

        {/* Charts Grid - Histogram and Pie Chart side by side */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Satisfaction Histogram */}
          <div>
            <SatisfactionHistogram ratings={metrics?.current?.ratings || []} />
          </div>

          {/* Call Type Distribution */}
          <div>
            <CategoryPieChart
              data={metrics?.current?.calls_by_type ? Object.entries(metrics.current.calls_by_type).map(([name, value]) => ({ name, value })) : []}
              totalCalls={metrics?.current?.total_calls || 0}
            />
          </div>
        </div>

        {/* Sentiment Gauge - Full Width Row */}
        <div className="mb-8">
          <SentimentGauge sentiments={{
            positive: metrics?.sentiments?.positive ?? 0,
            neutral: metrics?.sentiments?.neutral ?? 0,
            negative: metrics?.sentiments?.negative ?? 0
          }} />
        </div>

        {/* Top Clients Table - Full Width */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <TopClientsTable data={metrics?.topClients || []} />
        </div>

        {/* Loading State */}
        {!metrics && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          </div>
        )}
      </div>

      {/* RESIZER */}
      <div 
        className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-colors ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="w-3 h-3 text-gray-600" />
      </div>

      {/* RIGHT PANEL */}
      <div 
        className="p-6 overflow-y-auto bg-white"
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {/* Interval Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Período de Análisis</h2>
          <div className="flex gap-3">
            <button 
              onClick={() => setInterval("dia")} 
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                interval === "dia" 
                  ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              Hoy
            </button>
            <button 
              onClick={() => setInterval("semana")} 
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                interval === "semana" 
                  ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              Esta Semana
            </button>
            <button 
              onClick={() => setInterval("mes")} 
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                interval === "mes" 
                  ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              Este Mes
            </button>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Resumen Inteligente</h2>
          </div>

          {/* Loading State */}
          {(summaryMutation.status === "pending" || !aiSummary) ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-gray-600 mt-4 text-center">
                Generando análisis inteligente...
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Procesando métricas del {interval === "dia" ? "día" : interval === "semana" ? "semana" : "mes"}
              </p>
            </div>
          ) : (
            /* AI Summary Content */
            <div className="prose prose-sm max-w-none">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {aiSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}