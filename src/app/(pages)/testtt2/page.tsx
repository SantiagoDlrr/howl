'use client'
import { useState } from "react";
import { useClientChat } from "@/app/_components/sr/hooks/useClientChat";
import { useClientInsight } from "@/app/_components/sr/hooks/useClientInsight";
import EnhancedClientInsight from "@/app/_components/sr/EnhancedClientInsight";

export default function SmartRecommendationsPage() {
  const [clientId, setClientId] = useState<number | null>(null);
  const { clientInsight, fetchInsight, isLoading } = useClientInsight();

  const { chatHistory, chatInput, setChatInput, sendChat } = useClientChat((id) => {
    setClientId(id);
    fetchInsight(id);
  });

  return (
    <div className="flex w-full pt-16 h-[calc(100vh-4rem)]">
      {/* LEFT PANEL */}
      <div className="w-3/5 p-4 overflow-y-auto border-r">
        {/* ... animación y card como ya lo tienes ... */}
        {clientId && <p className="text-green-600 text-sm mb-3">Client ID reconocido: {clientId}</p>}
        {isLoading && <div>Cargando datos del cliente...</div>}
        {clientInsight && (
          <EnhancedClientInsight clientInsight={clientInsight} />
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-2/5 flex flex-col">
        <div className="p-4 pb-0">
          <h2 className="text-lg font-semibold">Howl AI</h2>
        </div>
        <div className="flex-1 p-4 pt-2 flex flex-col">
          <div className="flex-1 bg-gray-100 rounded p-3 overflow-y-auto">
            {chatHistory.map((msg, idx) => (
              <p key={idx} className="text-sm mb-2">{msg}</p>
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
              onClick={sendChat}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}