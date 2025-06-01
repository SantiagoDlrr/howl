// services/feedbackManagerService.ts
import { query } from "@/lib/database";
import type { FeedbackMetrics } from "../models/types";

type RawCallRow = {
  id: number;
  name: string;
  date: Date;
  duration: number;
  satisfaction: number;
  summary: string;
  client_id: number;
  type: string;
  sentiment_analysis: string;
  first_name: string;    // <-- nuevo
  last_name: string;     // <-- nuevo
  email: string;         // <-- nuevo
};

export type ClientDetails = {
  client_id: number;
  total_calls: number;
  avg_duration: number;
  avg_satisfaction: number;
  first_name: string;
  last_name: string;
  email: string;
};

export async function getCallsByRangeSP(
  consultantId: number,
  formattedDate: string,
  interval: "dia" | "semana" | "mes"
): Promise<RawCallRow[]> {
  const result = await query(
    `SELECT * FROM get_calls_by_range_v3($1, $2::date, $3)`,
    [consultantId, formattedDate, interval]
  );

  return (result as RawCallRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    date: new Date(row.date),
    duration: row.duration,
    satisfaction: row.satisfaction,
    summary: row.summary,
    client_id: row.client_id,
    type: row.type,
    sentiment_analysis: row.sentiment_analysis,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
  }));
}

export function groupByClient(calls: RawCallRow[], currentStart: Date): ClientDetails[] {
  const map = new Map<number, ClientDetails>();

  for (const call of calls) {
    if (new Date(call.date) < currentStart) continue;

    const existing = map.get(call.client_id);

    if (!existing) {
      map.set(call.client_id, {
        client_id: call.client_id,
        total_calls: 1,
        avg_duration: call.duration,
        avg_satisfaction: call.satisfaction,
        first_name: call.first_name,
        last_name: call.last_name,
        email: call.email,
      });
    } else {
      existing.total_calls += 1;
      existing.avg_duration += call.duration;
      existing.avg_satisfaction += call.satisfaction;
    }
  }

  return Array.from(map.values()).map((c) => ({
    ...c,
    avg_duration: c.avg_duration / c.total_calls,
    avg_satisfaction: c.avg_satisfaction / c.total_calls,
  }));
}


function countSentiments(calls: RawCallRow[]): Record<"positive" | "neutral" | "negative", number> {
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
  calls: RawCallRow[],
  currentStart: Date,
  previousStart: Date
): FeedbackMetrics {
  const group = (calls: RawCallRow[]) => {
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

  const topClients = groupByClient(calls, currentStart)
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