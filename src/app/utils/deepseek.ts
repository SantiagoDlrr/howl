// /utils/deepseek.ts

import OpenAI from "openai";
import { env } from "@/env"; // O process.env si no usas env.ts

type ChatRole = "user" | "assistant" | "system";


export const askDeepseek = async (
  prompt: string,
  history: { role: "user" | "assistant"; text: string }[],
  context?: string
): Promise<string> => {
  const contextMessage = context
    ? [{ role: "system", content: context }]
    : [];

  const messages = [
    ...contextMessage,
    ...history.map((m) => ({
      role: m.role,
      content: m.text,
    })),
    { role: "user", content: prompt },
  ];

  const response = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al consultar IA");
  return data.content;
};