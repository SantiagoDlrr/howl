// src/app/smartRecom/controllers/clientInsightController.ts
import { Request, Response } from 'express';
import { generateClientInsight } from '../services/clientInsightService';
import { FileData } from '../models/types';

// TEMP mock while DB is not ready
const mockClientCalls: Record<string, FileData[]> = {
  '1': [ {
    id: 1,
    name: 'angel_call_1.mp3',
    date: '2025-05-12',
    type: 'audio',
    duration: '5:34',
    report: {
      feedback: 'Cliente confundido por cambios de tarifa.',
      keyTopics: ['tarifa', 'cambio de plan'],
      emotions: ['confusión', 'frustración'],
      sentiment: 'Negativo',
      output: '',
      summary: 'El cliente expresó frustración por no ser notificado sobre ajustes en su tarifa.',
      rating: 58,
    },
  },
  {
    id: 2,
    name: 'angel_call_2.mp3',
    date: '2025-05-14',
    type: 'audio',
    duration: '7:12',
    report: {
      feedback: 'Cliente más tranquilo pero aún molesto.',
      keyTopics: ['atención al cliente', 'seguimiento'],
      emotions: ['desconfianza', 'preocupación'],
      sentiment: 'Neutral',
      output: '',
      summary: 'Se percibió un tono más tranquilo, pero con dudas sobre el seguimiento brindado.',
      rating: 65,
    },
  }, ]
};

export const getClientInsight = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const { id } = req.params;
    const calls = mockClientCalls[id]; // ✅ ahora ya no marca error
  
    if (!calls) return res.status(404).json({ error: 'Client not found' });
  
    try {
      const insight = await generateClientInsight(calls);
      res.json(insight);
    } catch (error) {
      console.error('Error generating insight:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };