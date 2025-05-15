// src/smartFeatures/services/aiService.ts
import axios from 'axios';

interface AIInput {
  systemPrompt: string;
  context: string;
  question: string;
}

export async function askAI({ systemPrompt, context, question }: AIInput): Promise<string> {
  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${context}\n\n${question}` }
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-exp:free',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.SITE_URL || '',
          'X-Title': process.env.SITE_NAME || '',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI error:', error);
    return 'No se pudo generar una recomendación. Intenta más tarde.';
  }
}
