import { z } from "zod";

export const addressSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    company_id: z.number().optional(),  
})

export const companySchema = z.object({
    name: z.string().min(1, "Nombre de la empresa vacío"),
    client_since: z.date(),
    satisfaction: z.number().optional(),
    address: addressSchema.optional(),
})