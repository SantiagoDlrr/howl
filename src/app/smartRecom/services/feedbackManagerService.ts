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
    sentiment_analysis: row.sentiment_analysis,
  }));
}

export function groupByClient(calls: Call[]) {
  const map = new Map<number, { total_calls: number; avg_duration: number; avg_satisfaction: number }>();

  for (const call of calls) {
    const clientData = map.get(call.client_id) || { total_calls: 0, avg_duration: 0, avg_satisfaction: 0 };

    clientData.total_calls += 1;
    clientData.avg_duration += call.duration;
    clientData.avg_satisfaction += call.satisfaction;

    map.set(call.client_id, clientData);
  }

  return Array.from(map.entries()).map(([client_id, data]) => ({
    client_id,
    total_calls: data.total_calls,
    avg_duration: data.avg_duration / data.total_calls,
    avg_satisfaction: data.avg_satisfaction / data.total_calls,
  }));
}

function countSentiments(calls: Call[]): Record<"positive" | "neutral" | "negative", number> {
  return calls.reduce(
    (acc, c) => {
      const key = (c.sentiment_analysis || "neutral").toLowerCase();
      if (key === "positive" || key === "neutral" || key === "negative") {
        acc[key]++;
      }
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );
}

export function generateFeedbackMetrics(
  calls: Call[],
  currentStart: Date,
  previousStart: Date
): FeedbackMetrics {
  const group = (calls: Call[]) => {
    const total_calls = calls.length;
    const total_duration = calls.reduce((sum, c) => sum + c.duration, 0);
    const avg_duration = total_calls ? total_duration / total_calls : 0;
    const avg_satisfaction = total_calls ? calls.reduce((sum, c) => sum + c.satisfaction, 0) / total_calls : 0;

    const ratings = calls.map((c) => c.satisfaction);
    const calls_by_type: Record<string, number> = {};
    for (const call of calls) {
      calls_by_type[call.type] = (calls_by_type[call.type] || 0) + 1;
    }

    return { total_calls, avg_duration, avg_satisfaction, total_duration, calls_by_type, ratings };
  };

  const current = calls.filter(c => new Date(c.date) >= currentStart);
  const previous = calls.filter(c => new Date(c.date) < currentStart && new Date(c.date) >= previousStart);

  const groupCurrent = group(current);
  const groupPrevious = group(previous);

  const topClients = groupByClient(current)
    .sort((a, b) => b.total_calls - a.total_calls)
    .slice(0, 5);

  return {
    current: groupCurrent,
    previous: groupPrevious,
    deltas: {
      total_calls: groupCurrent.total_calls - groupPrevious.total_calls,
      avg_satisfaction: groupCurrent.avg_satisfaction - groupPrevious.avg_satisfaction,
      avg_duration: groupCurrent.avg_duration - groupPrevious.avg_duration,
      total_duration: groupCurrent.total_duration - groupPrevious.total_duration,
    },
    sentiments: countSentiments(current),
    topClients,
  };
}