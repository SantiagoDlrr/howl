import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

interface CallData {
  context: string;
  satisfaction: number;
  duration: number;
  summary: string;
  date: string;
  transcript: string;
  main_ideas: string | number | boolean | null;
  type: string;
  consultant_id: number;
  client_id: number;
  feedback: string;
  sentiment_analysis: string;
  risk_words: string | number | boolean | null;
  output: string;
  emotion_names: string | number | boolean | null; // Array of emotion names (e.g., ["Happy", "Sad"])
}

// Función para obtener todas las llamadas de un consultor
export async function GET(request: Request) {
  try {
    // Extraer el consultantId desde los parámetros de la URL (query string)
    const { searchParams } = new URL(request.url);
    const consultantId = searchParams.get('id'); // Extrae el valor de 'id' de la URL

    if (!consultantId) {
      return NextResponse.json({ error: 'Consultant ID not provided' }, { status: 400 });
    }

    // Consultar las llamadas del consultor
    const results = await query(`
      SELECT c.date, co.name as company, c.id as call_id
      FROM calls c
      INNER JOIN client ci ON ci.id = c.client_id
      INNER JOIN companies co ON ci.company_id = co.id
      WHERE c.consultant_id = $1
      ORDER BY c.date DESC;
    `, [consultantId]);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching consultant calls:', error);
    return NextResponse.error();
  }
}


export async function POST(request: Request) {
    try {
      // Step 1: Parse the request body
      const data = await request.json() as CallData;
  
      const {
        context,
        satisfaction,
        duration,
        summary,
        date,
        transcript,
        main_ideas,
        type,
        consultant_id,
        client_id,
        feedback,
        sentiment_analysis,
        risk_words,
        output,
        emotion_names // Array of emotion names (e.g., ["Happy", "Sad"])
      } = data;
  
      // Step 2: Call the stored procedure to insert the data
      const result = await query(`
        SELECT insert_call_with_emotions(
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        ) AS call_id;
      `, [
        context,
        satisfaction,
        duration,
        summary,
        date,
        transcript,
        main_ideas,
        type,
        consultant_id,
        client_id,
        feedback,
        sentiment_analysis,
        risk_words,
        output,
        emotion_names
      ]);
  
      // Step 3: Get the inserted call ID
      const callId = result?.[0]?.call_id as number | undefined;
  
      // Step 4: Return the response with the inserted call ID
      return NextResponse.json({ callId });
  
    } catch (error) {
      console.error('Error inserting call with emotions:', error);
      return NextResponse.json({ error: 'Error creating call' }, { status: 500 });
    }
  }