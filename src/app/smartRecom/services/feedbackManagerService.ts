// /services/feedbackManagerService.ts
import { Call } from "../models/types";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export async function getMockedCallsForInterval(
  consultantId: number,
  interval: "day" | "week" | "month"
): Promise<Call[]> {
  const today = new Date();
  const yesterday = daysAgo(1);
  const lastWeek = daysAgo(7);
  const lastMonth = daysAgo(30);

  const allCalls: Call[] = [
    { id: 1, name: "Llamada Hoy", date: today, duration: 300, satisfaction: 4, summary: "Resumen hoy" },
    { id: 2, name: "Llamada Ayer", date: yesterday, duration: 240, satisfaction: 5, summary: "Resumen ayer" },
    { id: 3, name: "Llamada Semana", date: lastWeek, duration: 180, satisfaction: 3, summary: "Resumen semana" },
    { id: 4, name: "Llamada Mes", date: lastMonth, duration: 400, satisfaction: 2, summary: "Resumen mes" },
  ];

  if (interval === "day") return allCalls.filter(c => c.date.toDateString() === today.toDateString());
  if (interval === "week") return allCalls.filter(c => c.date >= daysAgo(7));
  if (interval === "month") return allCalls.filter(c => c.date >= daysAgo(30));

  return [];
}