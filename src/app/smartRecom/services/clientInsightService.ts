//smartRecom/services/clientInsightService.ts
import type { FileData, ClientInsightResponse } from '../models/types';
import { askAI } from './aiService';

// System prompts as constants
const SUMMARY_PROMPT = "Eres un analista de soporte al cliente. Tu trabajo es escribir un resumen narrativo breve y claro de dos párrafos, basado en varios reportes de llamadas de un mismo agente.";

const RECOMMENDATION_PROMPT = `Eres un analista senior de servicio al cliente. Tu objetivo es generar una recomendación práctica y profesional para que un agente retome contacto con un cliente.

Evita frases como "excelente pregunta" o introducciones innecesarias. Habla con tono profesional y directo. El agente leerá esta recomendación justo antes de llamar al cliente.

Incluye:
- Hallazgos clave
- Necesidades emocionales o temáticas del cliente
- Acciones sugeridas
- Consejos sobre tono, enfoque y preparación`;

const TOPICS_PROMPT = `Eres un analista experto en soporte al cliente. Tu tarea es leer varios reportes y detectar los temas más frecuentes entre ellos.`;

const EMOTION_PROMPT = `Eres un experto en análisis emocional. Tu tarea es detectar la emoción predominante en un conjunto de interacciones con clientes.`;

// Helper to parse JSON from AI responses
async function parseJsonArray(response: string): Promise<string[]> {
  try {
    const cleanResponse = response.replace(/```json\s*|```/g, '').trim();
    const parsed: unknown = JSON.parse(cleanResponse);

    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === 'object' && parsed[0] !== null && 'tema' in parsed[0]) {
        return parsed.map((t: { tema: string }) => t.tema);
      }
      return parsed as string[];
    }
    return [];
  } catch (e) {
    console.error("Error parsing JSON from AI:", e);
    return [];
  }
}

// Summarize multiple reports
export async function summarizeMultipleReports(reports: string): Promise<string> {
  return askAI({
    systemPrompt: SUMMARY_PROMPT,
    context: reports,
    question: `Genera un resumen narrativo en lenguaje natural que combine los puntos clave de todos los reportes anteriores. Este resumen será mostrado a un agente humano para entender el contexto emocional y temático del cliente.`,
  });
}

// Main client insight generator
export async function generateClientInsight(calls: FileData[]): Promise<ClientInsightResponse> {
  if (calls.length === 0) {
    throw new Error("No calls found for this client");
  }

  const lastCall = calls.reduce((latest, call) =>
    new Date(call.date) > new Date(latest.date) ? call : latest
  );

  const combinedSummaries = calls
    .map((c, idx) => `Reporte ${idx + 1} (${c.name}):\n${c.report.summary}`)
    .join("\n\n");

  const [summary, recommendation, topicAnalysis, emotionAnalysis] = await Promise.all([
    summarizeMultipleReports(combinedSummaries),
    askAI({
      systemPrompt: RECOMMENDATION_PROMPT,
      context: combinedSummaries,
      question: "¿Qué debe saber y cómo debe actuar el agente antes de contactar nuevamente al cliente?",
    }),
    askAI({
      systemPrompt: TOPICS_PROMPT,
      context: combinedSummaries,
      question: `Devuélveme solo un arreglo JSON plano con los 3 temas más consistentes. Cada tema debe tener máximo 2 palabras. Ejemplo: ["tema1", "tema2", "tema3"]`,
    }),
    askAI({
      systemPrompt: EMOTION_PROMPT,
      context: combinedSummaries,
      question: `En una sola palabra o frase corta, ¿cuál es la emoción dominante que se percibe a lo largo de estos reportes? Responde SOLO con la emoción, sin explicación.`,
    }),
  ]);

  const commonTopics = await parseJsonArray(topicAnalysis);
  const keyEmotions = [emotionAnalysis.trim()];

  return {
    clientName: calls[0]?.client_name || "Cliente Desconocido",
    lastContact: lastCall.date,
    summary,
    keyEmotions,
    commonTopics,
    recommendation,
    reports: calls,
  };
}