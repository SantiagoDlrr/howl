// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'El prompt es requerido' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usar el modelo correcto y especificar configuración
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });

    // Modificar el prompt para especificar el idioma español
    const promptWithLanguage = `Por favor, responde en español a la siguiente consulta: ${prompt}`;
    
    const result = await model.generateContent(promptWithLanguage);
    const text = result.response.text();

    return NextResponse.json({ resultado: text });
  } catch (error: any) {
    // Si falla con gemini-1.5-pro, intentar con gemini-1.0-pro
    if (error.message && error.message.includes("models/gemini-1.5-pro is not found")) {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey || "");
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.0-pro",
        });
        
        // Modificar el prompt para especificar el idioma español
        const promptWithLanguage = `Por favor, responde en español a la siguiente consulta: ${prompt}`;
        
        const result = await model.generateContent(promptWithLanguage);
        const text = result.response.text();
        
        return NextResponse.json({ resultado: text });
      } catch (secondError: any) {
        console.error('Error con modelo alternativo:', secondError);
        return NextResponse.json({ 
          error: 'Error al generar respuesta con modelo alternativo', 
          detalle: secondError.message || 'Error desconocido'
        }, { status: 500 });
      }
    }
    
    console.error('Error detallado:', error);
    return NextResponse.json({ 
      error: 'Error al generar respuesta', 
      detalle: error.message || 'Error desconocido',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}