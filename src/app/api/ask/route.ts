// /pages/api/ask.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Asegúrate que esta variable esté definida en .env.local SIN el prefijo NEXT_PUBLIC
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://tusitio.com", // reemplaza con tu dominio
    "X-Title": "Howl AI", // título para rankings en OpenRouter
  },
});

export async function POST(req: NextRequest) {
  try {
    // Leer y validar el cuerpo
    const body = await req.json();
    const messages = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Formato de mensajes inválido" },
        { status: 400 }
      );
    }

    console.log("🔍 Mensajes recibidos:", JSON.stringify(messages, null, 2));
    console.log("🔑 API Key activa:", !!process.env.OPENROUTER_API_KEY);

    // Llamar a la API de OpenRouter con modelo Deepseek
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages,
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
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