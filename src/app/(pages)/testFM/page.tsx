// testFM/page.tsx
'use client';

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { SentimentGauge } from "@/app/smartRecom/components/charts/SentimentGauge";
import { SatisfactionHistogram } from "@/app/smartRecom/components/charts/SatisfactionHistogram";
import { SatisfactionScoreBar } from "@/app/smartRecom/components/charts/SatisfactionPhaseBar";
import { StatCard } from "@/app/smartRecom/components/charts/StatCard";
import { PhoneCall, Clock, TimerReset } from "lucide-react";
import { CallTypePie } from "@/app/smartRecom/components/charts/CallTypePieChart";
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

  console.log("🔍 Top Clients:", metrics?.topClients);


  return (
    <div className="flex w-full pt-16 h-[calc(100vh-4rem)]">
      {/* LEFT PANEL */}
      <div className="w-3/5 p-4 border-r">
        <h2 className="text-lg font-semibold mb-2">Resumen</h2>
        {metrics ? (
          <div className="text-sm">
            <p>Llamadas actuales: {metrics.current.total_calls}</p>
            <p>Promedio satisfacción: {metrics.current.avg_satisfaction.toFixed(2)}</p>
            <p>Duración promedio: {metrics.current.avg_duration.toFixed(2)} s</p>
            <p>Total duración: {metrics.current.total_duration} s</p>
            <p>Cambio en llamadas: {metrics.deltas.total_calls}</p>
            <p>Cambio en satisfacción: {metrics.deltas.avg_satisfaction.toFixed(2)}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Esperando datos...</p>
        )}

        {metrics?.sentiments && (
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Distribución de sentimientos</h3>
            <SentimentGauge sentiments={metrics.sentiments} />
          </div>
        )}

        {metrics?.current?.ratings && metrics.current.ratings.length >= 0 ? (
          <div className="mt-6">
            <SatisfactionHistogram ratings={metrics.current.ratings} />
          </div>
        ) : (
          <p className="text-gray-400 text-sm mt-6">
            No hay suficientes datos hoy para mostrar el histograma de satisfacción.
          </p>
        )}

        {metrics?.current?.avg_satisfaction && (
          <div className="mt-6">
            <SatisfactionScoreBar 
              avgSatisfaction={metrics.current.avg_satisfaction}
              delta={metrics.deltas.avg_satisfaction}
            />
          </div>
        )}

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Llamadas Totales"
              value={metrics.current.total_calls}
              delta={safeDelta(metrics.current.total_calls, metrics.previous.total_calls)}
              icon={<PhoneCall className="w-4 h-4" />}
            />
            <StatCard
              label="Duración Promedio"
              value={formatMinutes(metrics.current.avg_duration / 60)}
              delta={safeDelta(metrics.current.avg_duration, metrics.previous.avg_duration)}
              icon={<Clock className="w-4 h-4" />}
            />
            <StatCard
              label="Duración Total"
              value={formatMinutes(metrics.current.total_duration / 60)}
              delta={safeDelta(metrics.current.total_duration, metrics.previous.total_duration)}
              icon={<TimerReset className="w-4 h-4" />}
            />
          </div>
        )}

        {metrics?.current?.calls_by_type && (
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Distribución por tipo</h3>
            <CallTypePie
              data={Object.entries(metrics.current.calls_by_type).map(([name, value]) => ({ name, value }))}
              totalCalls={metrics.current.total_calls}
            />
          </div>
        )}

        
        {metrics?.topClients && <TopClientsTable data={metrics.topClients} />}
        
      </div>

      {/* RIGHT PANEL */}
      <div className="w-2/5 p-4">
        <h2 className="text-lg font-semibold mb-2">Selecciona intervalo</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setInterval("dia")} className="px-4 py-2 bg-blue-600 text-white rounded">Hoy</button>
          <button onClick={() => setInterval("semana")} className="px-4 py-2 bg-blue-600 text-white rounded">Esta semana</button>
          <button onClick={() => setInterval("mes")} className="px-4 py-2 bg-blue-600 text-white rounded">Este mes</button>
        </div>

        {aiSummary && (
          <div className="border-t pt-4 mt-6">
            <h2 className="text-lg font-semibold text-gray-800">🧠 AI generated summary</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{aiSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
}