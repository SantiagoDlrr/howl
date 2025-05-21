import Fuse from "fuse.js";
import { askAI } from "./aiService";
import { mockClients } from "../data/mockClientDB";
import { api } from "@/trpc/react";
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
      question: `El usuario respondió: "${message}". ¿Es una afirmación clara de que acepta el nombre sugerido?`,
    });

    if (confirm.toLowerCase().includes("yes")) {
      const clientId = lastSuggestedClient.id;
      const clientName = lastSuggestedClient.name;
      lastSuggestedClient = null;

      // Log para consola
      console.log("AI resolver result:\n" + JSON.stringify({
        type: "client",
        id: clientId,
      }, null, 2));

      // JSON para el frontend
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

  // Paso 2: IA interpreta a quién se refiere el mensaje
  // const clientNames = mockClients.map((c) => c.name).join(", ");

  const clientNames = clients?.map((c) => (c.firstname + " " + c.lastname)).join(", ");
  const inferredName = await askAI({
    systemPrompt: "Eres un asistente que identifica a qué cliente se refiere un mensaje.",
    context: `Nombres disponibles: ${clientNames}`,
    question: `¿A qué nombre completo se refiere este mensaje?: "${message}". Si no puedes estar seguro, devuelve null.`,
  });

  // console.log("Inferred name:", inferredName);
  const match = fuse.search(inferredName)?.[0]?.item;
  // console.log("Match:", match);

  if (!match) {
    return "No pude identificar a ningún cliente con base en ese mensaje. ¿Puedes reformularlo?";
  }

  // Paso 3: Si no hay coincidencia exacta, sugerir nombre
  if (!inferredName.toLowerCase().includes(match.name.toLowerCase())) {
    lastSuggestedClient = { id: match.id, name: match.name };

    const suggestionReply = await askAI({
      systemPrompt: "Eres un asistente que confirma sugerencias de nombres.",
      context: `El usuario dijo: "${message}". El nombre más parecido es: "${match.name}"`,
      question: "Redacta una respuesta natural preguntando si se refiere a ese nombre.",
    });

    return suggestionReply;
  }

  // Coincidencia clara
  console.log("AI resolver result:\n" + JSON.stringify({
    type: "client",
    id: match.id,
  }, null, 2));

  return JSON.stringify({
    type: "client",
    id: match.id,
    message: `✅ Cliente identificado: ${match.name}. Generando insight...`,
  }, null, 2);
}