import { z } from "zod";

export const clientSchema = z.object({
    firstname: z.string().min(1, "Nombre vacío"),
    lastname: z.string().min(1, "Apellido vacío"),
    email: z.string().email("Correo inválido"),
    company_id: z.number().optional(),
})