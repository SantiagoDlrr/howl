// src/smartFeatures/services/clientInsightService.ts
import { FileData, ClientInsightResponse } from '../models/types';
import { buildClientContext } from './contextBuilder';
import { askAI } from './aiService';
import { mockClients, mockCompanies } from "../data/mockClientDB";
import { summarizeMultipleReports } from "./aiService"; // nuevo import


export async function getClientReports(clientId: string): Promise<FileData[]> {
  const client = mockClients.find(c => c.id === clientId);
  return client ? client.reports : [];
}

export async function getCompanyReports(companyId: string): Promise<FileData[]> {
  const clientsInCompany = mockClients.filter(c => c.companyId === companyId);
  return clientsInCompany.flatMap(c => c.reports);
}



export async function generateClientInsight(calls: FileData[]): Promise<ClientInsightResponse> {
  if (calls.length === 0) {
    throw new Error("No calls found for this client");
  }

  const lastCall = calls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]!;

  // ⚠️ Concatenar todos los resúmenes de reportes
  const combinedSummaries = calls
  .map((c, idx) => `Reporte ${idx + 1} (${c.name}):\n${c.report.summary}`)
  .join("\n\n");

  // ✅ Recomendación con base directa en esos resúmenes
  const recommendation = await askAI({
    systemPrompt: `Eres un analista senior de servicio al cliente. Tu objetivo es generar una recomendación práctica y profesional para que un agente retome contacto con un cliente.
  
  Evita frases como "excelente pregunta" o introducciones innecesarias. Habla con tono profesional y directo. El agente leerá esta recomendación justo antes de llamar al cliente.
  
  Incluye:
  - Hallazgos clave
  - Necesidades emocionales o temáticas del cliente
  - Acciones sugeridas
  - Consejos sobre tono, enfoque y preparación`,
    context: combinedSummaries,
    question: "¿Qué debe saber y cómo debe actuar el agente antes de contactar nuevamente al cliente?",
  });

  return {
    clientName: lastCall.name.replace(/\..*$/, ""),
    lastContact: lastCall.date,
    summary: combinedSummaries,
    keyEmotions: [...new Set(calls.flatMap(c => c.report.emotions))].slice(0, 5),
    commonTopics: [...new Set(calls.flatMap(c => c.report.keyTopics))].slice(0, 5),
    recommendation,
    reports: calls,
  };
}