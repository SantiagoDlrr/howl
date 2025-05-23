// test/testClientInsight.ts
/*import { generateClientInsight } from "../services/clientInsightService";
import { FileData } from '../models/types';

const mockCalls: FileData[] = [
  {
    client_name: 'Juan Pérez',
    id: 1,
    name: 'angel_call_1.mp3',
    date: new Date('2025-05-12'),
    type: 'audio',
    duration: 322,
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
    duration: 612,
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
];

(async () => {
  const insight = await generateClientInsight(mockCalls);
  console.log(JSON.stringify(insight, null, 2));
})();
*/