import React, { useRef, useState, useEffect } from "react";
import { ChevronUp, User } from "lucide-react";
import { askDeepseek } from "@/app/utils/deepseek";
import { ChatMessage } from "../chatMessage";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
  
    const newMessages: Message[] = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
  
    try {
      const reply = await askDeepseek(input, newMessages);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Ocurrió un error al consultar la IA 😓",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Pregúntame algo..."
            className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSubmit}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-purple-500"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};