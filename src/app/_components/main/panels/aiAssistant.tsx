import React, { useRef, useState, useEffect } from "react";
import { ChevronUp, User } from "lucide-react";
import { askDeepseek } from "@/app/utils/deepseek";
import { ChatMessage } from "../chatMessage";
import type { FileData } from "@/app/types/main";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface Props {
  selectedFileId: number | null;
  files: FileData[];
  initialMessages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
}

export const AiAssistant: React.FC<Props> = ({ selectedFileId, files, initialMessages, onUpdateMessages }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedFile = files.find((f) => f.id === selectedFileId);
  const report = selectedFile?.report ?? null;
  const transcript = selectedFile?.transcript ?? [];

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "38px"; // Reset height
      textareaRef.current.style.height = `${Math.min(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [input]);

  function generateContext(report: FileData["report"] | null, transcript: FileData["transcript"] = []): string {
    return `
Eres un asistente de inteligencia artificial que apoya a empleados de servicio al cliente a analizar sus propias llamadas con clientes.

Tu objetivo es ayudar al agente a identificar patrones, emociones, áreas de mejora y oportunidades, basándote en el siguiente análisis automatizado. Responde siempre de forma **breve, clara y enfocada**, evitando respuestas largas o repetitivas.

📋 **Resumen del Análisis de Llamada:**
- 🗣️ Feedback general: ${report?.feedback ?? "No disponible"}
- 🧹 Temas clave tratados: ${(report?.keyTopics ?? []).join(", ") ?? "Ninguno"}
- 😊 Emociones predominantes: ${(report?.emotions ?? []).join(", ") ?? "No identificadas"}
- ❤️ Sentimiento global de la llamada: ${report?.sentiment ?? "No disponible"}
- ⚠️ Palabras de riesgo detectadas: ${report?.riskWords ?? "Ninguna"}
- 🧠 Interpretación automática (output): ${report?.output ?? "No disponible"}
- 🗘️ Resumen general de la llamada: ${report?.summary ?? "No disponible"}

🗃 **Fragmentos relevantes de la transcripción:**
${transcript.map((t) => `- ${t.speaker ?? "Desconocido"}: ${t.text}`).join("\n").slice(0, 2000)}

Responde únicamente con base en esta información. Si el usuario te pregunta algo fuera de este contexto, indícale amablemente que solo puedes apoyar con el análisis de la llamada. Sé conciso y profesional.
    `.trim();
  }

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    onUpdateMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const contextText = generateContext(report, transcript);
      const reply = await askDeepseek(input, newMessages, contextText);

      if (!reply || reply.trim() === "") throw new Error("Respuesta vacía");

      const updatedMessages: Message[] = [...newMessages, { role: "assistant", text: reply }];
      setMessages(updatedMessages);
      onUpdateMessages(updatedMessages);
    } catch (err) {
      console.error("🧨 Error al procesar respuesta:", err);
      const fallback: Message[] = [
        ...newMessages,
        {
          role: "assistant",
          text: "Ocurrió un error al consultar la IA 😓",
        },
      ];
      setMessages(fallback);
      onUpdateMessages(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return (
    <div className="bg-white flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-t border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Asistente Howl AI</h2>
        <div className="h-3 w-3 rounded-full bg-green-400" title="Disponible"></div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <User className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm mb-4 max-w-xs">
              Escribe una pregunta y nuestra IA resumirá al instante los puntos clave,
              recordará detalles, redactará contenido y descubrirá información a partir
              de la transcripción.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} text={msg.text} />
            ))}
            {loading && <ChatMessage role="assistant" text="Pensando..." />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="relative flex items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            placeholder="Pregúntame algo..."
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none min-h-[38px] max-h-[100px] overflow-y-auto"
            rows={1}
          />
          <button
            onClick={handleSubmit}
            className="absolute right-2 bottom-2 flex items-center justify-center text-purple-500"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};