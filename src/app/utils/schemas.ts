import { z } from "zod";

export const passwordSchema = z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/\d/, "La contraseña debe tener al menos un número")
    .regex(/[!@#$%^&*]/, "La contraseña debe tener al menos un caracter especial");

export const emailSchema = z.string().email("Correo inválido")