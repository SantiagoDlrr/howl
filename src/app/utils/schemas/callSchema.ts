import { z } from "zod";

export const emotionsSchema = z.object({
    call_id: z.number(),
    emotion_id: z.number(),
});

export const transcriptEntrySchema = z.object({
    speaker: z.string(),
    text: z.string(),
    timestamp: z.number().optional(),
});

export const callSchema = z.object({
    name: z.string().optional(),
    context: z.string().optional(),
    satisfaction: z.number().optional(),
    duration: z.number(),
    summary: z.string().optional(),
    date: z.date(),
    transcript: z.string().optional(),
    main_ideas: z.array(z.string()),
    type: z.string().optional(),
    consultant_id: z.number(),
    client_id: z.number(),
    feedback: z.string().optional(),
    sentiment_analysis: z.string().optional(),
    risk_words: z.array(z.string()),
    output: z.string().optional(),
    diarized_transcript: z.array(transcriptEntrySchema).optional(),
});