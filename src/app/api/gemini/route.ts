// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Datos dummy directamente en el archivo
const dummyData = {
  clients: [
    {
      id: "client1",
      name: "Roberto García",
      email: "roberto@innovatec.com",
      company: "Innovaciones Tecnológicas S.A.",
      phone: "+34 612 345 678"
    },
    {
      id: "client2",
      name: "Ana Martínez",
      email: "ana@consultora.com",
      company: "Consultora Digital",
      phone: "+34 623 456 789"
    },
    {
      id: "client3",
      name: "Carlos Rodríguez",
      email: "carlos@distribuciones.com",
      company: "Distribuciones Globales",
      phone: "+34 634 567 890"
    }
  ],
  calls: [
    {
      id: "call1",
      clientId: "client1",
      date: "2023-05-15T10:30:00Z",
      topic: "Presentación de nuevos servicios",
      summary: "Se presentaron los nuevos servicios de IA. Roberto mostró interés en implementar chatbots."
    },
    {
      id: "call2",
      clientId: "client1",
      date: "2023-05-20T14:00:00Z",
      topic: "Seguimiento de propuesta",
      summary: "Se discutieron detalles técnicos. Roberto solicitó una demostración."
    },
    {
      id: "call3",
      clientId: "client1",
      date: "2023-05-25T09:00:00Z",
      topic: "Demostración de producto",
      status: "Pendiente"
    },
    {
      id: "call4",
      clientId: "client2",
      date: "2023-05-18T11:30:00Z",
      topic: "Renovación de contrato",
      summary: "Ana está interesada en renovar el contrato por 2 años más con mejoras en el servicio."
    },
    {
      id: "call5",
      clientId: "client3",
      date: "2023-05-22T16:00:00Z",
      topic: "Resolución de incidencia",
      summary: "Se resolvió el problema de acceso al sistema. Carlos quedó satisfecho con la solución."
    }
  ]
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'El prompt es requerido' }, { status: 400 });
    }

    // Analizar el prompt para determinar qué datos necesitamos
    const lowerPrompt = prompt.toLowerCase();
    let contextData = "";
    
    // Si pregunta por Roberto
    if (lowerPrompt.includes('roberto')) {
      const robertoInfo = dummyData.clients.find(client => 
        client.name.toLowerCase().includes('roberto')
      );
      
      const robertoCalls = dummyData.calls.filter(call => 
        call.clientId === robertoInfo?.id
      );
      
      contextData += `
      Información del cliente Roberto:
      ${JSON.stringify(robertoInfo, null, 2)}
      
      Llamadas con Roberto:
      ${JSON.stringify(robertoCalls, null, 2)}
      `;
    } 
    // Si pregunta por llamadas o conversaciones
    else if (lowerPrompt.includes('llamada') || lowerPrompt.includes('conversacion')) {
      contextData += `
      Llamadas recientes:
      ${JSON.stringify(dummyData.calls, null, 2)}
      `;
    }
    // Si pregunta por clientes o usuarios
    else if (lowerPrompt.includes('cliente') || lowerPrompt.includes('usuario')) {
      contextData += `
      Clientes:
      ${JSON.stringify(dummyData.clients, null, 2)}
      `;
    }
    // Si no pregunta por nada específico, proporcionar todos los datos
    else {
      contextData += `
      Resumen de datos disponibles:
      - Clientes: ${dummyData.clients.length || 0}
      - Llamadas: ${dummyData.calls.length || 0}
      
      Muestra de clientes:
      ${JSON.stringify(dummyData.clients.slice(0, 3), null, 2)}
      
      Muestra de llamadas recientes:
      ${JSON.stringify(dummyData.calls.slice(0, 3), null, 2)}
      `;
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

    // Modificar el prompt para incluir el contexto y especificar el idioma español
    const enrichedPrompt = `
    Eres un asistente de IA llamado Howl AI que ayuda con información sobre clientes y llamadas.
    
    DATOS DISPONIBLES:
    ${contextData}
    
    INSTRUCCIONES:
    - Responde siempre en español.
    - Usa los datos proporcionados para responder de manera precisa.
    - Si te preguntan por Roberto, usa la información específica de Roberto.
    - Si te preguntan por llamadas o conversaciones, proporciona detalles sobre las llamadas.
    - Sé conciso y claro en tus respuestas.
    - Formatea la información de manera legible para el usuario.
    
    PREGUNTA DEL USUARIO:
    ${prompt}
    
    Tu respuesta:`;
    
    const result = await model.generateContent(enrichedPrompt);
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
        
        // Analizar el prompt para determinar qué datos necesitamos
        const lowerPrompt = prompt.toLowerCase();
        let contextData = "";
        
        // Si pregunta por Roberto
        if (lowerPrompt.includes('roberto')) {
          const robertoInfo = dummyData.clients.find(client => 
            client.name.toLowerCase().includes('roberto')
          );
          
          const robertoCalls = dummyData.calls.filter(call => 
            call.clientId === robertoInfo?.id
          );
          
          contextData += `
          Información del cliente Roberto:
          ${JSON.stringify(robertoInfo, null, 2)}
          
          Llamadas con Roberto:
          ${JSON.stringify(robertoCalls, null, 2)}
          `;
        } 
        // Si pregunta por llamadas o conversaciones
        else if (lowerPrompt.includes('llamada') || lowerPrompt.includes('conversacion')) {
          contextData += `
          Llamadas recientes:
          ${JSON.stringify(dummyData.calls, null, 2)}
          `;
        }
        // Si pregunta por clientes o usuarios
        else if (lowerPrompt.includes('cliente') || lowerPrompt.includes('usuario')) {
          contextData += `
          Clientes:
          ${JSON.stringify(dummyData.clients, null, 2)}
          `;
        }
        // Si no pregunta por nada específico, proporcionar todos los datos
        else {
          contextData += `
          Resumen de datos disponibles:
          - Clientes: ${dummyData.clients.length || 0}
          - Llamadas: ${dummyData.calls.length || 0}
          
          Muestra de clientes:
          ${JSON.stringify(dummyData.clients.slice(0, 3), null, 2)}
          
          Muestra de llamadas recientes:
          ${JSON.stringify(dummyData.calls.slice(0, 3), null, 2)}
          `;
        }
        
        // Modificar el prompt para incluir el contexto y especificar el idioma español
        const enrichedPrompt = `
        Eres un asistente de IA llamado Howl AI que ayuda con información sobre clientes y llamadas.
        
        DATOS DISPONIBLES:
        ${contextData}
        
        INSTRUCCIONES:
        - Responde siempre en español.
        - Usa los datos proporcionados para responder de manera precisa.
        - Si te preguntan por Roberto, usa la información específica de Roberto.
        - Si te preguntan por llamadas o conversaciones, proporciona detalles sobre las llamadas.
        - Sé conciso y claro en tus respuestas.
        - Formatea la información de manera legible para el usuario.
        
        PREGUNTA DEL USUARIO:
        ${prompt}
        
        Tu respuesta:`;
        
        const result = await model.generateContent(enrichedPrompt);
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