import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

// Type definitions based on the received data structure
interface TranscriptEntry {
  speaker: string;
  text: string;
  start?: number;
  end?: number;
}

interface Report {
  feedback: string;
  keyTopics: string[];
  emotions: string[];
  sentiment: string;
  output: string;
  riskWords: string[];
  summary: string;
  rating: number;
}

// Interface for the payload our API route will receive
interface CallDataPayload {
  id: string; // UUID from the upload service
  diarized_transcript: TranscriptEntry[];
  full_transcript_text: string;
  report_data: Report;
  date: string; // Format: "MM/DD/YYYY"
  duration: string; // Format: "HH:MM:SS"
  name?: string; // Optional filename or call name
  
  // Required IDs for database relations
  consultant_id: number;
  client_id: number;
  context?: string; // Optional context
}

// Helper function to convert HH:MM:SS duration to seconds
function durationToSeconds(durationStr: string): number {
  if (!durationStr || !durationStr.includes(':')) {
    console.warn(`Invalid duration format: ${durationStr}. Defaulting to 0.`);
    return 0;
  }
  const parts = durationStr.split(':');
  if (parts.length !== 3) {
    console.warn(`Invalid duration format: ${durationStr}. Defaulting to 0.`);
    return 0;
  }
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  const seconds = parseInt(parts[2] || '0', 10);
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    console.warn(`Non-numeric part in duration: ${durationStr}. Defaulting to 0.`);
    return 0;
  }
  return hours * 3600 + minutes * 60 + seconds;
}

// Helper function to format date from MM/DD/YYYY to YYYY-MM-DD for PostgreSQL
function formatDateForDB(dateStr: string): string {
  if (!dateStr || dateStr.split('/').length !== 3) {
    console.warn(`Invalid date format: ${dateStr}. Returning as is.`);
    return dateStr;
  }
  const [month, day, year] = dateStr.split('/');
  if (!month || !day || !year || month.length !== 2 || day.length !== 2 || year.length !== 4) {
    console.warn(`Invalid date components for: ${dateStr}. Returning as is.`);
    return dateStr;
  }
  return `${year}-${day}-${month}`;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as CallDataPayload;
    

    // Validate required fields
    if (!payload.report_data || !payload.full_transcript_text || !payload.consultant_id || !payload.client_id) {
      return NextResponse.json({ error: 'Missing required fields in payload' }, { status: 400 });
    }

    const {
      report_data,
      full_transcript_text,
      date,
      duration,
      consultant_id,
      client_id,
      context,
    } = payload;

    const {
      feedback,
      keyTopics,
      emotions,
      sentiment,
      output,
      riskWords,
      summary,
      rating,
    } = report_data;

    // Prepare data for database insertion
    const callContext = context || `Uploaded call: ${payload.name || 'Untitled'}`;
    const callSatisfaction = rating;
    const callDurationInSeconds = durationToSeconds(duration);
    const callSummary = summary;
    const callDate = formatDateForDB(date);
    const callTranscript = full_transcript_text;
    // const callMainIdeas = keyTopics ? JSON.stringify(keyTopics) : null;
    // const callRiskWords = riskWords ? JSON.stringify(riskWords) : null;
  
  const callMainIdeas = keyTopics ? keyTopics : null; // Pass the array directly
    const callRiskWords = riskWords ? riskWords : null; // Pass the array directly
    // const callRiskWords = ['Risk', 'words'];
    
    const callEmotionNames = emotions ? emotions : null; // Pass the array directly

    const callType = "Uploaded Audio";
    const callFeedback = feedback;
    const callSentimentAnalysis = sentiment;
    const callOutput = output;
    // const callEmotionNames = emotions ? JSON.stringify(emotions) : null;


    // console.log('Inserting call with values:', {
    //   callContext,
    //   callSatisfaction,
    //   callDurationInSeconds,
    //   callSummary,
    //   callDate,
    //   callTranscript,
    //   callMainIdeas,
    //   callType,
    //   consultant_id,
    //   client_id,
    //   callFeedback,
    //   callSentimentAnalysis,
    //   callRiskWords,
    //   callOutput,
    //   callEmotionNames
    // });



    // Insert data using the stored procedure
    const rows = await query<{ call_id: number }>(`
      CALL insert_call_with_emotions(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
      ) ;
    `, [
      callContext,
      callSatisfaction,
      callDurationInSeconds,
      callSummary,
      callDate,
      callTranscript,
      callMainIdeas,
      callType,
      consultant_id,
      client_id,
      callFeedback,
      callSentimentAnalysis,
      callRiskWords,
      callOutput,
      callEmotionNames,
    ]);

    const callId = rows[0]?.call_id; 

    if (!callId) {
      console.error('Failed to insert call or retrieve call_id from stored procedure.', rows);
      return NextResponse.json({ error: 'Failed to create call in database' }, { status: 500 });
    }

    // Return the response with the inserted call ID
    return NextResponse.json({ 
      success: true,
      callId,
      message: 'Call data successfully uploaded to database'
    });





    
  } catch (error) {
    console.error('Error processing call data:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Internal server error while processing call data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}




