// services/aiSummaryService.ts
// Service for metric analysis 
// smartFeatures/services/aiSummaryService.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import type { FeedbackMetrics } from "../models/types";
import { askAI } from "./aiService";

export async function generateAISummaryFromMetrics(metrics: FeedbackMetrics, interval: "dia" | "semana" | "mes") {
  const { current, previous, deltas, sentiments, topClients } = metrics;

  console.log("🧪 Generando summary con métricas:", { metrics, interval });

  const context = `
--- MÉTRICAS ACTUALES ---
Total de llamadas: ${current.total_calls}
Duración total: ${formatMin(current.total_duration)}
Promedio de duración: ${formatMin(current.avg_duration)}
Promedio de satisfacción: ${current.avg_satisfaction.toFixed(1)}

Distribución por tipo:
${Object.entries(current.calls_by_type).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

Sentimientos:
- Positivas: ${sentiments.positive}
- Neutrales: ${sentiments.neutral}
- Negativas: ${sentiments.negative}

--- CAMBIOS RESPECTO A ANTERIOR ---
Diferencia en total de llamadas: ${deltas.total_calls}
Diferencia en promedio de duración: ${formatMinDelta(deltas.avg_duration)}
Diferencia en promedio de satisfacción: ${deltas.avg_satisfaction.toFixed(1)}

Top 5 clientes:
${topClients.map(c => `- ${c.client_id}: ${c.total_calls} llamadas, duración ${formatMin(c.avg_duration)}, satisfacción ${c.avg_satisfaction.toFixed(1)}`).join("\n")}
`;

  const question = `Con base en estas métricas de desempeño del intervalo '${interval}', genera un breve resumen para el agente. Sé claro, directo y útil. Menciona los avances positivos y las áreas a mejorar.`;

  const systemPrompt = `Eres un coach digital experto en atención al cliente. Ayudas a los agentes a mejorar su rendimiento con base en métricas semanales o diarias.`;

  const summary = await askAI({ systemPrompt, context, question });
  return summary.trim();
}

function formatMin(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}min`;
  } else {
    return `${minutes.toFixed(1)} min`;
  }
}

function formatMinDelta(delta: number): string {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatMin(Math.abs(delta))}`;
}

// API endpoint para llamar desde el frontend
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { metrics, interval } = req.body;

  try {
    const summary = await generateAISummaryFromMetrics(metrics, interval);
    res.status(200).json({ summary });
  } catch (error) {
    console.error("❌ Error generando resumen IA:", error);
    res.status(500).json({ error: "Falló la generación de resumen con IA." });
  }
}