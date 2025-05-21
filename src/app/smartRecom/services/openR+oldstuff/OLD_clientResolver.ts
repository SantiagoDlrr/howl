// src/app/smartRecom/services/clientResolver.ts
import { askAI } from "./aiService";
import { ClientEntity, mockClients, mockCompanies } from "../data/mockClientDB"; // Asegúrate de tener este archivo con mocks
import Fuse from "fuse.js"


const fuse = new Fuse(mockClients, {
  keys: ["name"],
  threshold: 0.4,
});

export function findClosestClientName(input: string): ClientEntity | null {
  const result = fuse.search(input);
  return result.length > 0 ? result[0]?.item ?? null : null;
}

export async function resolveClientOrCompany(query: string): Promise<
  | { type: "client"; id: string }
  | { type: "company"; id: string }
  | null
> {
  const names = [
    ...mockClients.map((c) => `Cliente: ${c.name} (ID: ${c.id})`),
    ...mockCompanies.map((c) => `Empresa: ${c.name} (ID: ${c.id})`),
  ].join("\n");

  const prompt = `Tienes una lista de nombres de clientes y empresas. Tu trabajo es detectar a quién se refiere el usuario. Si hay un error de escritura, intenta adivinar correctamente.

    Lista:
    ${names}

    Pregunta del usuario:
    ${query}

    Responde sólo con un JSON válido con las propiedades { type: 'client' | 'company', id: 'id_string' }.`;

  const raw = await askAI({
    systemPrompt: "Eres un asistente que mapea nombres humanos a registros en una base de datos.",
    context: "",
    question: prompt,
  });

  try {
    const parsed = JSON.parse(raw);
    if (
      (parsed.type === "client" || parsed.type === "company") &&
      typeof parsed.id === "string"
    ) {
      return parsed;
    }
    return null;
  } catch (e) {
    console.error("Error parsing AI resolver output:", raw);
    return null;
  }
}

export async function suggestClientFromQuery(query: string): Promise<{
    suggestion: string | null;
    suggestedId: string | null;
    aiMessage: string;
  }> {
    const closest = findClosestClientName(query);
  
    if (!closest) {
      return {
        suggestion: null,
        suggestedId: null,
        aiMessage: `No encontré a nadie con el nombre "${query}". ¿Podrías escribirlo de nuevo?`,
      };
    }
  
    const aiMessage = await askAI({
      systemPrompt: "Eres un asistente cordial que ayuda a corregir nombres mal escritos.",
      context: `El usuario escribió: "${query}". El nombre más parecido que encontramos es: "${closest.name}".`,
      question: "Genera una respuesta amigable para sugerir ese nombre como posible corrección.",
    });
  
    return {
      suggestion: closest.name,
      suggestedId: closest.id,
      aiMessage,
    };
  }

  export async function isAffirmative(response: string): Promise<boolean> {
    const aiReply = await askAI({
      systemPrompt: "Eres un asistente que interpreta si el usuario dice 'sí' o 'no'.",
      context: "",
      question: `El usuario respondió: "${response}". ¿Esto es una afirmación clara? Responde solo con 'yes' o 'no'.`,
    });
  
    return aiReply.toLowerCase().includes("yes");
  }