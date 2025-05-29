// 2. feedbackManagerService.ts
import { query } from "@/lib/database";
import { Call, FeedbackMetrics } from "../models/types";


export async function getCallsByRangeSP(
  consultantId: number,
  formattedDate: string,
  interval: "dia" | "semana" | "mes"
): Promise<Call[]> {
  const result = await query(
    `SELECT * FROM get_calls_by_range_v2($1, $2::date, $3)`,
    [consultantId, formattedDate, interval]
  );

  return result.map((row: any) => ({
    id: row.id,
    name: row.name,
    date: new Date(row.date),
    duration: row.duration,
    satisfaction: row.satisfaction,
    summary: row.summary,
    client_id: row.client_id,
    type: row.type,
  }));
}

export function generateFeedbackMetrics(
  calls: Call[],
  splitDate: Date
): FeedbackMetrics {
  const group = (calls: Call[]) => {
    const total_calls = calls.length;
    const total_duration = calls.reduce((sum, c) => sum + c.duration, 0);
    const avg_duration = total_calls ? total_duration / total_calls : 0;
    const avg_satisfaction = total_calls ? calls.reduce((sum, c) => sum + c.satisfaction, 0) / total_calls : 0;

    const calls_by_type: Record<string, number> = {};
    for (const call of calls) {
      calls_by_type[call.type] = (calls_by_type[call.type] || 0) + 1;
    }

    return { total_calls, avg_duration, avg_satisfaction, total_duration, calls_by_type };
  };

  const today = new Date();
    const currentStart = new Date(today);
    const previousStart = new Date(today);

    if (splitDate) {
    // nada, backward compatibility
    } else {
    throw new Error("splitDate must be defined");
    }

    // Definir rangos
    if (calls.length && calls[0] && calls[0].date instanceof Date) {
    if (calls.length > 0 && calls.length < 1000) {
        if (splitDate.getDate() === today.getDate()) {
        // Para 'día'
        currentStart.setHours(0, 0, 0, 0);
        previousStart.setDate(today.getDate() - 1);
        previousStart.setHours(0, 0, 0, 0);
        } else if (splitDate.getDate() <= today.getDate() - 7) {
        // Para 'semana'
        currentStart.setDate(today.getDate() - 6);
        previousStart.setDate(today.getDate() - 13);
        } else if (splitDate.getDate() <= today.getDate() - 30) {
        // Para 'mes'
        currentStart.setDate(today.getDate() - 29);
        previousStart.setDate(today.getDate() - 59);
        }
    }
    }

    const current = calls.filter(c => {
    const date = new Date(c.date);
    return date >= currentStart;
    });

    const previous = calls.filter(c => {
    const date = new Date(c.date);
    return date < currentStart && date >= previousStart;
    });

  const groupCurrent = group(current);
  const groupPrevious = group(previous);

  return {
    current: groupCurrent,
    previous: groupPrevious,
    deltas: {
      total_calls: groupCurrent.total_calls - groupPrevious.total_calls,
      avg_satisfaction: groupCurrent.avg_satisfaction - groupPrevious.avg_satisfaction,
      avg_duration: groupCurrent.avg_duration - groupPrevious.avg_duration,
      total_duration: groupCurrent.total_duration - groupPrevious.total_duration,
    },
  };
}