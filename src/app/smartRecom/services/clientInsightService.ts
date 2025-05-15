// src/smartFeatures/services/clientInsightService.ts
import { FileData, ClientInsightResponse } from '../models/types';
import { buildClientContext } from './contextBuilder';
import { askAI } from './aiService';

export async function generateClientInsight(calls: FileData[]): Promise<ClientInsightResponse> {
    if (calls.length === 0) {
      throw new Error('No calls found for this client');
    }
  
    const lastCall = calls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]!;
  
    // Now lastCall is safely defined
    const context = buildClientContext(calls);
  
    const recommendation = await askAI({
      systemPrompt: 'Eres un coach de agentes de soporte experto en análisis emocional de clientes.',
      context,
      question: '¿Qué debe saber el agente antes de volver a contactar a este cliente?'
    });
  
    return {
      clientName: lastCall.name.replace(/\..*$/, ''),
      lastContact: lastCall.date,
      summary: lastCall.report.summary,
      keyEmotions: [...new Set(calls.flatMap(c => c.report.emotions))].slice(0, 5),
      commonTopics: [...new Set(calls.flatMap(c => c.report.keyTopics))].slice(0, 5),
      recommendation,
      reports: calls,
    };
  }