// routers/smartInsights.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import { generateClientInsight } from "howl/app/smartRecom/services/clientInsightService";
import type { FileData } from "howl/app/smartRecom/models/types";

// TEMP: mock data
const mockClientCalls: Record<string, FileData[]> = {
  '1': [
    {
      client_name: 'Juan Pérez',
      id: 1,
      name: 'angel_call_1.mp3',
      date: new Date('2025-05-12'),
      type: 'audio',
      duration: 150,
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
      client_name: 'Juan Pérez',
      id: 2,
      name: 'angel_call_2.mp3',
      date: new Date('2025-05-14'),
      type: 'audio',
      duration: 260,
      report: {
        feedback: 'Cliente más tranquilo pero aún molesto.',
        keyTopics: ['atención al cliente', 'seguimiento'],
        emotions: ['desconfianza', 'preocupación'],
        sentiment: 'Neutral',
        output: '',
        summary: 'Se percibió un tono más tranquilo, pero con dudas sobre el seguimiento brindado.',
        rating: 65,
      },
    },
   ]
};

export const smartInsightRouter = createTRPCRouter({
  getClientInsight: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const calls = mockClientCalls[input.id];
      if (!calls) throw new Error("Client not found");

      const insight = await generateClientInsight(calls);
      return insight;
    }),
});