// api/ask.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://tusitio.com",
    "X-Title": "Howl AI",
  },
}); 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Formato de mensajes inválido" },
        { status: 400 }
      );
    }

    console.log("🧾 Mensajes enviados a Deepseek:", JSON.stringify(messages, null, 2));

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages,
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      console.warn("⚠️ No se recibió content de Deepseek", completion);
      throw new Error("No se recibió contenido de respuesta.");
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("💥 Error en /api/ask:", error.message || error);
    return NextResponse.json(
      { error: "Deepseek no respondió correctamente." },
      { status: 500 }
    );
  }
}