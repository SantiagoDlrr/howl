// /utils/deepseek.ts

import OpenAI from "openai";
import { env } from "@/env"; // O process.env si no usas env.ts

type ChatRole = "user" | "assistant" | "system";


export const askDeepseek = async (
    prompt: string,
    history: { role: "user" | "assistant"; text: string }[]
  ): Promise<string> => {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          ...history.map((m) => ({
            role: m.role,
            content: m.text,
          })),
          { role: "user", content: prompt },
        ],
      }),
    });
  
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error("Respuesta no válida del servidor 😵‍💫");
    }
  
    if (!response.ok) {
      throw new Error(data?.error || "Error desconocido al consultar IA");
    }
  
    return data.content;
  };
