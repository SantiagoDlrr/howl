// 4. pages/testFM/page.tsx
'use client';
import { api } from "@/trpc/react";
import { useState } from "react";

export default function SmartFeedbackPage() {
  const [interval, setInterval] = useState<"dia" | "semana" | "mes">("dia");
  const consultantId = 77;

  const metricsQuery = api.feedbackManager.getFeedbackMetrics.useQuery(
    { consultantId, interval },
    { enabled: !!consultantId }
  );

  const metrics = metricsQuery.data;

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
      </div>

      {/* RIGHT PANEL */}
      <div className="w-2/5 p-4">
        <h2 className="text-lg font-semibold mb-2">Selecciona intervalo</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setInterval("dia")} className="px-4 py-2 bg-blue-600 text-white rounded">Hoy</button>
          <button onClick={() => setInterval("semana")} className="px-4 py-2 bg-blue-600 text-white rounded">Esta semana</button>
          <button onClick={() => setInterval("mes")} className="px-4 py-2 bg-blue-600 text-white rounded">Este mes</button>
        </div>
      </div>
    </div>
  );
}
