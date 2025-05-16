"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export default function SmartRecommendationsPage() {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientInsight, setClientInsight] = useState<any>(null);

  const chatMutation = api.clientResolver.conversationalResolve.useMutation();
  const insightMutation = api.clientInsight.getClientInsight.useMutation();

  const handleChatMessage = async () => {
    if (!chatInput.trim()) return;

    setChatHistory((prev) => [...prev, `Tú: ${chatInput}`]);

    chatMutation.mutate(
      { message: chatInput },
      {
        onSuccess: (res) => {
          setChatInput("");

          try {
            const parsed = JSON.parse(res.response);
            const message = parsed.message || res.response;

            setChatHistory((prev) => [...prev, `AI: ${message}`]);

            if (parsed?.type === "client" && parsed?.id) {
              setClientId(parsed.id);
              insightMutation.mutate({ id: parsed.id }, {
                onSuccess: (insight) => setClientInsight(insight),
              });
            }
          } catch {
            // respuesta plana (no JSON)
            setChatHistory((prev) => [...prev, `AI: ${res.response}`]);
          }
        },
      }
    );
  };

  return (
    <div className="flex w-full divide-x pt-16 h-[calc(100vh-4rem)]">
      {/* LEFT PANEL */}
      <div className="w-1/3 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold">🧠 Client Insight</h2>
        {clientId && <p className="text-green-600 text-sm">Client ID reconocido: {clientId}</p>}
        {insightMutation.isPending && <p>Loading insight...</p>}
        {clientInsight && (
          <pre className="mt-2 bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(clientInsight, null, 2)}
          </pre>
        )}
      </div>

      {/* CENTER PANEL */}
      <div className="w-2/3 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">🤖 Chat con AI (Resolución de Cliente)</h2>
        <div className="flex-1 bg-gray-100 rounded p-3 overflow-y-auto">
          {chatHistory.map((msg, idx) => (
            <p key={idx} className="text-sm whitespace-pre-wrap mb-2">
              {msg}
            </p>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Escribe algo..."
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleChatMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
