import { z } from "zod";

export const addressSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    company_id: z.number().optional(),  
})

export const emotionSchema = z.object({
    name: z.string().min(1, "Nombre de la emoción vacío"),
})

export const callEmotions = z.object({
    call_id: z.number(),
    emotion_id: z.number(),
})

export const callSchema = z.object({
    context: z.string().optional(),
    satisfaction: z.number().optional(),
    duration: z.number(),
    summary: z.string().optional(),
    transcript: z.string().optional(),
    date: z.date(),
    keywords: z.string().array(),
    type: z.string().optional(),
    consultant_id: z.number().optional(),
    client_id: z.number().optional(),
    call_emotions: z.array(z.object({ call_id: z.number(), emotion_id: z.number() })).optional(),
  });

export const clientSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email("Correo inválido"),
    company_id: z.number().optional(),
})

export const companySchema = z.object({
    name: z.string().min(1, "Nombre de la empresa vacío"),
    client_since: z.date(),
    satisfaction: z.number().optional(),
    address: addressSchema.optional(),
})