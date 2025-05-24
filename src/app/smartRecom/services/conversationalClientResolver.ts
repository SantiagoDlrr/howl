// 📁 core/chatClientController.ts
import Fuse from "fuse.js";
import { askAI } from "./aiService";
import { client } from "@prisma/client";

const dynamicSuccessExamples = [
  "Cliente identificado: {{name}}. Preparando análisis...",
  "Encontré a {{name}}. Iniciando generación de insights...",
  "Vamos con {{name}}. Procesando información...",
  "Cliente {{name}} localizado. Vamos a ver qué encontramos...",
  "Analizando los datos de {{name}}. Un momento..."
];

const dynamicErrorExamples = [
  "No pude encontrar coincidencias claras con ese nombre. ¿Podrías intentar de nuevo?",
  "Ups, ese nombre no lo ubico. ¿Lo puedes escribir diferente o completo?",
  "Nada por aquí... ¿Puedes verificar cómo se escribe el nombre del cliente?",
  "Hmm... ese nombre no me suena. ¿Podrías reformularlo?"
];

/**
 * Controlador principal del chat IA para identificar clientes y responder según el flujo natural.
 */
export async function chatClientController(message: string, clients: client[]): Promise<string> {
  const cleanedMessage = message.trim().toLowerCase();

  const clientsForFuse = clients.map(client => ({
    id: client.id,
    name: `${client.firstname} ${client.lastname}`
  }));

  const fuse = new Fuse(clientsForFuse, {
    keys: ["name"],
    threshold: 0.4,
  });

  // Paso 1: IA interpreta si el mensaje es una solicitud de info + nombre
  const clientNames = clients.map(c => `${c.firstname} ${c.lastname}`).join(", ");
  const instructionCheck = await askAI({
    systemPrompt: `Eres un asistente que detecta si el usuario quiere información sobre un cliente. Solo responde con el nombre del cliente si puedes inferirlo, o con el intento del nombre de cliente de este mensaje \"${message}\" si no puedes.`,
    context: `Nombres disponibles: ${clientNames}`,
    question: `¿Qué nombre completo de cliente está pidiendo el usuario en: \"${message}\"?`,
  });

  if (!instructionCheck || instructionCheck.toLowerCase() === "null") {
    return "No pude identificar a ningún cliente con base en ese mensaje. ¿Puedes reformularlo con el nombre completo del cliente?";
  }

  const match = fuse.search(instructionCheck)?.[0]?.item;

  if (!match) {
    return `No encontré ningún cliente que coincida con "${instructionCheck}". ¿Puedes escribir el nombre completo correctamente?`;
  }

  const successMessage = await askAI({
    systemPrompt: "Eres un asistente que responde de forma amigable, profesional y variada. Solo devuelve una frase, sin listas ni explicaciones.",
    context: dynamicSuccessExamples.map(e => e.replace("{{name}}", match.name)).join("\n"),
    question: `Redacta solo una frase para confirmar que se identificó al cliente ${match.name}.`,
  });

  return JSON.stringify({
    type: "client",
    id: match.id,
    message: successMessage,
  }, null, 2);
}
