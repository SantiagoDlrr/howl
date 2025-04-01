import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

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

// Función para obtener detalles de una llamada específica
export async function GET_CALL_DETAILS(request: Request, { params }: { params: { callId: string } }) {
  try {
    // Extraer el callId de los parámetros de la URL
    const { callId } = params;

    if (!callId) {
      return NextResponse.json({ error: 'Call ID not provided' }, { status: 400 });
    }

    // Consultar los detalles de la llamada
    const callDetails = await query(`
      SELECT c.date, c.feedback, c.main_ideas, e.name as emotion, c.sentiment_analysis,
      c.output, c.risk_words, c.summary
      FROM calls c
      LEFT JOIN call_emotions ce ON ce.call_id = c.id
      LEFT JOIN emotions e ON e.id = ce.emotion_id
      WHERE c.id = $1;
    `, [callId]);

    return NextResponse.json(callDetails);
  } catch (error) {
    console.error('Error fetching call details:', error);
    return NextResponse.error();
  }
}

export async function insertCallWithEmotions(
    context: string,
    satisfaction: number,
    duration: number,
    summary: string,
    date: string,  // Ensure you format this correctly (YYYY-MM-DD)
    transcript: string,
    main_ideas: string[],  // Assuming array of strings
    type: string,
    consultant_id: number,
    client_id: number,
    feedback: string,
    sentiment_analysis: string,
    risk_words: string,
    output: string,
    emotion_names: string[]  // Array of emotion names to insert into call_emotions
  ) {
    try {
      // Insert into the calls table and get the new call_id
      const insertCallQuery = `
        INSERT INTO calls (
          "context", "satisfaction", "duration", "summary", "date", 
          "transcript", "main_ideas", "type", "consultant_id", "client_id", 
          "feedback", "sentiment_analysis", "risk_words", "output"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id;
      `;
      
      const result = await query(insertCallQuery, [
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
        output
      ]);
      
      const call_id = result.rows[0].id;
  
      // Insert into call_emotions table (many-to-many relationship)
      for (const emotion_name of emotion_names) {
        // Query to get emotion_id by emotion_name
        const emotionQuery = `
          SELECT id FROM emotions WHERE name = $1;
        `;
        
        const emotionResult = await query(emotionQuery, [emotion_name]);
        if (emotionResult.rows.length === 0) {
          throw new Error(`Emotion "${emotion_name}" not found`);
        }
  
        const emotion_id = emotionResult.rows[0].id;
  
        // Insert into call_emotions
        const insertEmotionQuery = `
          INSERT INTO call_emotions (call_id, emotion_id) 
          VALUES ($1, $2);
        `;
        await query(insertEmotionQuery, [call_id, emotion_id]);
      }
  
      return call_id;  // Return the ID of the new call record
  
    } catch (error) {
      console.error('Error inserting call and emotions:', error);
      throw error;
    }
  }