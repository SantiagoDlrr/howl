// pages/testFM/page.tsx
'use client'

import { api } from "@/trpc/react";
import { useState } from "react";

export default function SmartFeedbackPage() {
  // Hook embebido temporalmente para prototipado
  const [interval, setInterval] = useState<"day" | "week" | "month">("day");
  const consultantId = 1;

  const feedbackQuery = api.feedbackManager.getCallsByInterval.useQuery(
    { consultantId, interval },
    {
      // keepPreviousData: true,
    }
  );

  const fetchFeedback = (newInterval: "day" | "week" | "month") => {
    setInterval(newInterval);
  };

  const reports = feedbackQuery.data ?? [];
  const isLoading = feedbackQuery.isFetching;

  return (
    <div className="flex w-full pt-16 h-[calc(100vh-4rem)]">
      {/* LEFT PANEL - muestra los reportes */}
      <div className="w-3/5 p-4 border-r">
        <h2 className="text-lg font-semibold mb-2">Reportes encontrados</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Cargando llamadas...</p>
        ) : reports.length > 0 ? (
          <ul className="text-sm">
            {reports.map((report, idx) => (
              <li key={typeof report === 'object' && report.id ? report.id : idx}>
                Reporte ID: {typeof report === 'object' && report.id ? report.id : String(report)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Esperando intervalo...</p>
        )}
      </div>

      {/* RIGHT PANEL - botones de control */}
      <div className="w-2/5 p-4">
        <h2 className="text-lg font-semibold mb-2">Selecciona intervalo</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => fetchFeedback("day")} className="px-4 py-2 bg-blue-600 text-white rounded">Hoy</button>
          <button onClick={() => fetchFeedback("week")} className="px-4 py-2 bg-blue-600 text-white rounded">Esta semana</button>
          <button onClick={() => fetchFeedback("month")} className="px-4 py-2 bg-blue-600 text-white rounded">Este mes</button>
        </div>
      </div>
    </div>
  );
}