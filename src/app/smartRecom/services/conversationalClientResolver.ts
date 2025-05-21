// 📁 core/chatClientController.ts
import Fuse from "fuse.js";
import { askAI } from "./aiService";
import { client } from "@prisma/client";

let lastSuggestedClient: { id: number; name: string } | null = null;

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

  // Paso 1: Si estamos esperando confirmación del usuario
  if (lastSuggestedClient) {
    const confirm = await askAI({
      systemPrompt: "Eres un validador. Responde solo 'yes' o 'no'.",
      context: "",
      question: `El usuario respondió: \"${message}\". ¿Es una afirmación clara de que acepta el nombre sugerido?`,
    });

    if (confirm.toLowerCase().includes("yes")) {
      const clientId = lastSuggestedClient.id;
      const clientName = lastSuggestedClient.name;
      lastSuggestedClient = null;

      return JSON.stringify({
        type: "client",
        id: clientId,
        message: `✅ Cliente identificado: ${clientName}. Generando insight...`,
      }, null, 2);
    } else {
      lastSuggestedClient = null;
      return "Ok, intenta escribir el nombre correctamente para volver a buscar.";
    }
  }

  // Paso 2: IA interpreta si el mensaje es una solicitud de info + nombre
  const clientNames = clients.map(c => `${c.firstname} ${c.lastname}`).join(", ");
  const instructionCheck = await askAI({
    systemPrompt: "Eres un asistente que detecta si el usuario quiere información sobre un cliente.",
    context: `Nombres disponibles: ${clientNames}`,
    question: `El usuario dijo: \"${message}\". ¿Está pidiendo información de un cliente con nombre incluido? Si sí, responde solo el nombre. Si no, responde 'null'.`,
  });

  if (!instructionCheck || instructionCheck.toLowerCase() === "null") {
    return "No entendí a qué cliente te refieres o qué necesitas. Por favor, intenta escribir algo como: 'dame info de Juan Pérez'.";
  }

  const match = fuse.search(instructionCheck)?.[0]?.item;

  if (!match) {
    return "No pude identificar a ningún cliente con base en ese mensaje. ¿Puedes reformularlo?";
  }

  if (!instructionCheck.toLowerCase().includes(match.name.toLowerCase())) {
    lastSuggestedClient = { id: match.id, name: match.name };

    const suggestionReply = await askAI({
      systemPrompt: "Eres un asistente que confirma sugerencias de nombres.",
      context: `El usuario dijo: \"${message}\". El nombre más parecido es: \"${match.name}\"` ,
      question: "Redacta una respuesta natural preguntando si se refiere a ese nombre.",
    });

    return suggestionReply;
  }

  return JSON.stringify({
    type: "client",
    id: match.id,
    message: `✅ Cliente identificado: ${match.name}. Generando insight...`,
  }, null, 2);
}