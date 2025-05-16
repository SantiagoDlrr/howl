import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────
// Type definitions based on the received data structure
// ─────────────────────────────────────────────────────────
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
  id: string;                    // UUID from the upload service
  diarized_transcript: TranscriptEntry[];
  full_transcript_text: string;
  report_data: Report;
  date: string;                  // Format: "MM/DD/YYYY"
  duration: string;              // Format: "HH:MM:SS"
  name?: string;                 // Optional filename or call name

  // Required IDs for database relations
  consultant_id: number;
  client_id: number;
  context?: string;              // Optional context
}

// ─────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────
function durationToSeconds(durationStr: string): number {
  if (!durationStr || !durationStr.includes(':')) {
    console.warn(⁠ Invalid duration format: ${durationStr}. Defaulting to 0. ⁠);
    return 0;
  }
  const parts = durationStr.split(':');
  if (parts.length !== 3) {
    console.warn(⁠ Invalid duration format: ${durationStr}. Defaulting to 0. ⁠);
    return 0;
  }
  const hours   = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  const seconds = parseInt(parts[2] || '0', 10);
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    console.warn(⁠ Non-numeric part in duration: ${durationStr}. Defaulting to 0. ⁠);
    return 0;
  }
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDateForDB(dateStr: string): string {
  if (!dateStr || dateStr.split('/').length !== 3) {
    console.warn(⁠ Invalid date format: ${dateStr}. Returning as is. ⁠);
    return dateStr;
  }
  const [month, day, year] = dateStr.split('/');
  if (!month || !day || !year || month.length !== 2 || day.length !== 2 || year.length !== 4) {
    console.warn(⁠ Invalid date components for: ${dateStr}. Returning as is. ⁠);
    return dateStr;
  }
  return ⁠ ${year}-${day}-${month} ⁠;   // YYYY-MM-DD
}

// ─────────────────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const payload = await request.json() as CallDataPayload;

    // Validate required fields
    if (!payload.report_data ||
        !payload.full_transcript_text ||
        !payload.consultant_id ||
        !payload.client_id) {
      return NextResponse.json(
        { error: 'Missing required fields in payload' },
        { status: 400 }
      );
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
    const callContext            = context || ⁠ Uploaded call: ${payload.name || 'Untitled'} ⁠;
    // const callSatisfaction       = rating;
    const callSatisfaction     = 4; 
    const callDurationInSeconds  = durationToSeconds(duration);
    const callSummary            = summary;
    const callDate               = formatDateForDB(date);
    const callTranscript         = full_transcript_text;
    const callMainIdeas          = keyTopics ?? null;                // text[]
    const callRiskWords          = Array.isArray(riskWords) ? riskWords : [];
    const callEmotionNames       = emotions ?? null;                 // text[]
    const callType               = 'Uploaded Audio';
    const callFeedback           = feedback;
    const callSentimentAnalysis  = sentiment;
    const callOutput             = output;

    // ─────────────────────────────────────────────────────
    // Use SELECT instead of CALL (function, not procedure)
    // Explicit casts avoid “unknown” param types
    // ─────────────────────────────────────────────────────
    const rows = await query<{ call_id: number }>(`
      SELECT insert_call_with_emotions(
        $1 ::text,      -- context
        $2 ::int,       -- rating
        $3 ::int,       -- duration (seconds)
        $4 ::text,      -- summary
        $5 ::date,      -- date
        $6 ::text,      -- transcript
        $7 ::text[],    -- main ideas
        $8 ::text,      -- call type
        $9 ::int,       -- consultant_id
        $10::int,       -- client_id
        $11::text,      -- feedback
        $12::text,      -- sentiment
        $13::text[],    -- risk words
        $14::text,      -- output
        $15::text[]     -- emotions
      ) AS call_id;
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
      console.error(
        'Failed to insert call or retrieve call_id from function.',
        rows
      );
      return NextResponse.json(
        { error: 'Failed to create call in database' },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      callId,
      message: 'Call data successfully uploaded to database'
    });

  } catch (error) {
    console.error('Error processing call data:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: 'Internal server error while processing call data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}