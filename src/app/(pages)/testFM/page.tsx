'use client';

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { SentimentGauge } from "@/app/smartRecom/components/charts/SentimentGauge";
import { SatisfactionHistogram } from "@/app/smartRecom/components/charts/SatisfactionHistogram";
import { SatisfactionScoreBar } from "@/app/smartRecom/components/charts/SatisfactionPhaseBar";
import { StatCard } from "@/app/smartRecom/components/charts/StatCard";
import { PhoneCall, Clock, TimerReset, GripVertical, Calendar, CalendarDays, CalendarRange, Brain, Sparkles, TrendingUp } from "lucide-react";
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

// Markdown parser component
const MarkdownText = ({ text }: { text: string }) => {
  const parseMarkdown = (content: string) => {
    // Handle headers
    content = content.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2 first:mt-0">$1</h3>');
    content = content.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-3 first:mt-0">$1</h2>');
    content = content.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">$1</h1>');
    
    // Handle bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    // Handle italic text
    content = content.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>');
    
    // Handle bullet points
    content = content.replace(/^[\-\*] (.*$)/gim, '<li class="ml-4 text-gray-700">• $1</li>');
    
    // Wrap consecutive list items in ul
    content = content.replace(/(<li.*<\/li>)/gs, '<ul class="space-y-1 my-3">$1</ul>');
    
    // Handle line breaks
    content = content.replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-3">');
    content = '<p class="text-gray-700 leading-relaxed mb-3">' + content + '</p>';
    
    // Handle numbered lists
    content = content.replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 text-gray-700">$1. $2</li>');
    
    return content;
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }}
    />
  );
};

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

  const intervalOptions = [
    { key: "dia", label: "Hoy", icon: Calendar, description: "Métricas de hoy" },
    { key: "semana", label: "Esta semana", icon: CalendarDays, description: "Últimos 7 días" },
    { key: "mes", label: "Este mes", icon: CalendarRange, description: "Mes actual" }
  ];

  console.log("🔍 Top Clients:", metrics?.topClients);

  return (
    <div className="flex w-full pt-16 h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* LEFT PANEL - Resizable */}
      <div 
        className="p-6 bg-white/60 backdrop-blur-sm overflow-y-auto border-r border-gray-200/50"
        style={{ width: `${leftPanelWidth}%` }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] rounded-2xl shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#B351FF] to-[#9d44e8] bg-clip-text text-transparent">
                Dashboard de Rendimiento
              </h1>
              <p className="text-gray-600">Resumen de métricas y análisis</p>
            </div>
          </div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
            <SatisfactionHistogram ratings={metrics?.current?.ratings || []} />
          </div>

          {/* Call Type Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
            <CategoryPieChart
              data={metrics?.current?.calls_by_type ? Object.entries(metrics.current.calls_by_type).map(([name, value]) => ({ name, value })) : []}
              totalCalls={metrics?.current?.total_calls || 0}
            />
          </div>
        </div>

        {/* Sentiment Gauge - Full Width Row */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
          <SentimentGauge sentiments={{
            positive: metrics?.sentiments?.positive ?? 0,
            neutral: metrics?.sentiments?.neutral ?? 0,
            negative: metrics?.sentiments?.negative ?? 0
          }} />
        </div>

        {/* Top Clients Table - Full Width */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200/50">
          <TopClientsTable data={metrics?.topClients || []} />
        </div>

        {/* Loading State */}
        {!metrics && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src="/images/loading.gif" 
                  alt="Loading metrics..." 
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <p className="text-gray-600 font-medium">Cargando métricas...</p>
            </div>
          </div>
        )}
      </div>

      {/* RESIZER */}
      <div 
        className={`w-1 bg-gray-300/50 hover:bg-[#B351FF] cursor-col-resize flex items-center justify-center transition-all duration-200 ${
          isDragging ? 'bg-[#B351FF]' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="w-3 h-3 text-gray-600" />
      </div>

      {/* RIGHT PANEL - Modern Design */}
      <div 
        className="overflow-hidden bg-white/80 backdrop-blur-sm"
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#B351FF] to-[#9d44e8] text-white">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-semibold">Control Panel</h2>
              <p className="text-purple-100 text-sm">Configuración y análisis inteligente</p>
            </div>
          </div>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          {/* Interval Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#B351FF]" />
              Período de Análisis
            </h3>
            
            <div className="space-y-3">
              {intervalOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = interval === option.key;
                
                return (
                  <button
                    key={option.key}
                    onClick={() => setInterval(option.key as "dia" | "semana" | "mes")}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                      isSelected
                        ? 'border-[#B351FF] bg-gradient-to-r from-[#B351FF]/10 to-purple-100/50 shadow-lg'
                        : 'border-gray-200 bg-white/60 hover:border-[#B351FF]/50 hover:bg-[#B351FF]/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected 
                          ? 'bg-[#B351FF] text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          isSelected ? 'text-[#B351FF]' : 'text-gray-800'
                        }`}>
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-3 h-3 bg-[#B351FF] rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Summary Section */}
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
            {/* AI Summary Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">Resumen Inteligente</h3>
                  <p className="text-sm text-gray-600">Análisis generado por IA</p>
                </div>
                {summaryMutation.isPending && (
                  <img 
                    src="/images/loading.gif" 
                    alt="Processing..." 
                    className="w-6 h-6"
                  />
                )}
              </div>
            </div>

            {/* AI Summary Content */}
            <div className="p-6">
              {(summaryMutation.isPending || !aiSummary) ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-6">
                    <img 
                      src="/images/loading.gif" 
                      alt="Generating AI analysis..." 
                      className="w-20 h-20 mx-auto"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Generando análisis</h4>
                    <p className="text-gray-600 mb-1">
                      Procesando métricas del{" "}
                      {interval === "dia" ? "día" : interval === "semana" ? "semana" : "mes"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      La IA está analizando los datos para generar insights personalizados
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#B351FF]" />
                    <span className="text-sm font-medium text-[#B351FF]">
                      Análisis completado
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#B351FF]/20 to-transparent"></div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                    <MarkdownText text={aiSummary} />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200/50">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>Última actualización: {new Date().toLocaleTimeString()}</span>
                      </div>
                      <span className="bg-[#B351FF]/10 text-[#B351FF] px-2 py-1 rounded-full text-xs">
                        IA Generado
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}