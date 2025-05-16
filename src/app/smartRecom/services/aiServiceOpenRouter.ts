// services/aiService.ts
import axios, { AxiosError } from 'axios';

interface AIInput {
  systemPrompt: string;
  context: string;
  question: string;
}

export async function askAIOpenRouter({ systemPrompt, context, question }: AIInput): Promise<string> {
  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${context}\n\n${question}` },
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-exp:free',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.SITE_URL || '',
          'X-Title': process.env.SITE_NAME || '',
        },
      }
    );

    console.log('AI raw response:', response.data);

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('AI returned unexpected response format:', response.data);
      return 'La IA no devolvió una respuesta válida.';
    }

    return content;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('AI error (Axios):', error.response?.data || error.message);
    } else {
      console.error('AI error (Unknown):', error);
    }
    return 'No se pudo generar una recomendación. Intenta más tarde.';
  }
}
