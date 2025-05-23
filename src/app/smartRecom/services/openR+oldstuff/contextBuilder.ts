// src/smartFeatures/services/contextBuilder.ts
import { FileData } from '../../models/types';

export function buildClientContext(calls: FileData[]): string {
  const emotions = calls.flatMap(c => c.report.emotions);
  const topics = calls.flatMap(c => c.report.keyTopics);

  const topEmotions = [...new Set(emotions)].slice(0, 3).join(', ');
  const topTopics = [...new Set(topics)].slice(0, 3).join(', ');
  const lastCall = calls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!lastCall) {
    return 'No hay datos disponibles para construir el contexto del cliente.';
  }

  return `
Cliente: ${lastCall.name.replace(/\..*$/, '')}
Última llamada: ${lastCall.date}
Emociones frecuentes: ${topEmotions}
Temas comunes: ${topTopics}
Resumen reciente: ${lastCall.report.summary}
  `.trim();
}

