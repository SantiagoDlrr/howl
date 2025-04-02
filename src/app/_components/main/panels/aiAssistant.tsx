"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronUp, User } from "lucide-react";
import { askDeepseek } from "../../../utils/deepseek";

/** Internal shape for our chat messages. */
interface Message {
  role: "user" | "assistant";
  content: string; // We'll store the message text in 'content'
}

interface AiAssistantProps {
  /** The ID of the transcript or call file, if any. */
  selectedFileId: number | null;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ selectedFileId }) => {
  // Which LLM to use: local vs deepseek
  const [mode, setMode] = useState<"local" | "deepseek">("local");

  // Keep a local copy of the file ID, synced with the prop
  const [localFileId, setLocalFileId] = useState<number | null>(selectedFileId);

  useEffect(() => {
    setLocalFileId(selectedFileId);
  }, [selectedFileId]);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // For auto-scroll
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle between local and deepseek
  const toggleMode = () => {
    setMode((prev) => (prev === "local" ? "deepseek" : "local"));
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message to the local chat
    const userMessage: Message = {
      role: "user",
      content: inputValue.trim(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);

    try {
      if (mode === "local") {
        // -- LOCAL MODE --
        if (!localFileId) {
          alert("No call file selected! Cannot use local mode.");
          return;
        }

        // The local endpoint expects messages with 'content'
        // We'll only send the last user message here, but you can adjust if needed
        const payload = {
          transcript_id: localFileId.toString(),
          messages: [
            {
              role: "user",
              content: userMessage.content, // local expects 'content'
            },
          ],
        };

        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`Chat request failed: ${response.statusText}`);
        }
        const data = await response.json();

        // The local API's response has an 'assistant_message' field
        const aiReply: Message = {
          role: "assistant",
          content: data.assistant_message || "(No reply)",
        };
        setMessages((prev) => [...prev, aiReply]);
      } else {
        // -- DEEPSEEK MODE --
        // Deepseek wants messages with 'text'. So we map:
        const mappedMessages = newMessages.map((m) => ({
          role: m.role,
          text: m.content, // deepseek expects 'text'
        }));

        // We also pass userMessage.content as the new question
        const reply = await askDeepseek(userMessage.content, mappedMessages);
        const aiReply: Message = {
          role: "assistant",
          content: reply,
        };
        setMessages((prev) => [...prev, aiReply]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            mode === "local"
              ? "Error: Unable to get AI response from local endpoint."
              : "Ocurrió un error al consultar la IA 😓",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-t border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Asistente Howl AI</h2>
        <div className="h-3 w-3 rounded-full bg-green-400" title="Disponible"></div>
      </div>

      {/* Toggle button for switching modes */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <span className="text-gray-600">
          Modo actual: <strong>{mode}</strong>
        </span>
        <button
          className="py-1 px-3 text-white bg-purple-600 hover:bg-purple-700 rounded-md text-sm"
          onClick={toggleMode}
        >
          Cambiar a {mode === "local" ? "deepseek" : "local"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <User className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm mb-4 max-w-xs">
              Escribe una pregunta y nuestra IA resumirá al instante los puntos
              clave, recordará detalles, redactará contenido y descubrirá
              información a partir de la transcripción.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-md text-sm ${
                  msg.role === "assistant"
                    ? "bg-gray-100 text-gray-700 self-start"
                    : "bg-purple-100 text-purple-900 self-end"
                }`}
                style={{
                  maxWidth: "80%",
                  marginLeft: msg.role === "assistant" ? 0 : "auto",
                }}
              >
                <strong>
                  {msg.role === "assistant" ? "Asistente" : "Tú"}:
                </strong>{" "}
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="p-3 rounded-md text-sm bg-gray-100 text-gray-700 self-start">
                <strong>Asistente:</strong> Pensando...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Pregúntame algo..."
            className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center px-3 text-purple-500"
            onClick={handleSend}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
