// smartFeatures/services/aiSummaryService.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import type { FeedbackMetrics } from "../models/types";
import { askAI } from "./aiService";

export async function generateAISummaryFromMetrics(metrics: FeedbackMetrics, interval: "dia" | "semana" | "mes") {
  const { current, previous, deltas, sentiments, topClients } = metrics;

  console.log("🧪 Generando summary con métricas:", { metrics, interval });

  // Verifica si no hay datos reales
  if (
    current.total_calls === 0 &&
    current.total_duration === 0 &&
    current.avg_duration === 0 &&
    current.avg_satisfaction === 0
  ) {
    return "No hay datos suficientes en este intervalo para generar un resumen. Intenta con otro periodo.";
  }

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
Top 5 clientes:
${topClients.map(c => 
  `- ${c.first_name} ${c.last_name} (${c.email}): ${c.total_calls} llamadas, duración ${formatMin(c.avg_duration)}, satisfacción ${c.avg_satisfaction}`
).join("\n")}

`;

  const systemPrompt = `Eres un coach digital experto en atención al cliente. Tu trabajo es analizar métricas de desempeño y generar un resumen claro, útil y profesional para el agente.

Tu resumen debe incluir:
- Comparaciones entre el periodo actual y el anterior.
- Avances positivos, retrocesos y tendencias.
- Observaciones sobre clientes, emociones y temas frecuentes.
- Datos destacados o atípicos (por ejemplo: muchas llamadas nuevas, un pico inusual de satisfacción, caída en duración, etc).

Si las métricas actuales son 0 (sin llamadas), menciona que no hay datos suficientes para este intervalo y sugiere intentar con otro periodo.`;

  const question = `Con base en estas métricas del intervalo '${interval}', genera un resumen de desempeño extensivo. Usa frases como:

- "Tu satisfacción promedio subió de X a Y, ¡buen trabajo!"
- "Sin embargo, tu duración promedio aumentó de A a B minutos."
- "El X% de las llamadas fueron con clientes nuevos."
- "El tema más recurrente fue 'problemas con envíos', que no apareció la semana pasada."

Evita repetir los datos literalmente, tu objetivo es interpretarlos y destacar lo más importante para el agente. Sé claro, concreto y evita relleno innecesario.`;

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