/*
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

const genAI = new GoogleGenerativeAI(env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

interface ChatHistoryItem {
  role: "user" | "model";
  text: string;
}

export const askGemini = async (
  prompt: string,
  history: ChatHistoryItem[] = []
): Promise<string> => {
  try {
    const contents = [
      ...history.map((item) => ({
        role: item.role,
        parts: [{ text: item.text }],
      })),
      { role: "user", parts: [{ text: prompt }] },
    ];

    const result = await model.generateContent({ contents });
    return result.response.text();
  } catch (err: any) {
    console.error("Error consultando Gemini:", err);
    throw new Error("Gemini no respondió.");
  }
};

*/