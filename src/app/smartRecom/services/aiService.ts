import { GoogleGenAI } from '@google/genai';

interface AIInput {
  systemPrompt: string;
  context: string;
  question: string;
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function askAI({ systemPrompt, context, question }: AIInput): Promise<string> {
  try {
    const prompt = `${systemPrompt}\n\nContexto:\n${context.slice(0, 5000)}\n\nPregunta:\n${question}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('❌ Gemini no devolvió contenido:', response);
      return 'La IA no devolvió una respuesta válida.';
    }

    return text;
  } catch (error) {
    console.error('🧠 Error en Gemini API:', error);
    return 'No se pudo generar una recomendación. Intenta más tarde.';
  }
}