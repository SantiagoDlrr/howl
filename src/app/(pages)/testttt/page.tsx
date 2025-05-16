"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import EnhancedClientInsight from "@/app/_components/sr/EnhancedClientInsight";

export default function SmartRecommendationsPage() {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientInsight, setClientInsight] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handleCardClick = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Auto-hide after 3 seconds
  };

  return (
    <div className="flex w-full pt-16 h-[calc(100vh-4rem)]">
      {/* LEFT PANEL - Increased width to 60% */}
      <div className="w-3/5 p-4 overflow-y-auto border-r">
        {/* Animated Card Header */}
        <div 
          className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mb-4 shadow-md cursor-pointer relative overflow-hidden animate-pulse-subtle transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] border border-green-200"
          onClick={handleCardClick}
          style={{
            animation: "cardPulse 3s infinite, borderGlow 2s infinite"
          }}
        >
          {/* Full card background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 via-green-50/30 to-green-100/50 animate-wave" 
               style={{
                 backgroundSize: "200% 100%",
                 animation: "wave 8s infinite linear"
               }}
          />
          
          {/* Moving shine effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 skew-x-12 animate-sweep" 
                 style={{
                   left: "-100%",
                   animation: "sweep 3s infinite ease-in-out"
                 }}
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex items-center">
            <span className="text-2xl mr-2 animate-float" style={{ animation: "float 3s infinite ease-in-out" }}>🧠</span>
            <div>
              <h2 className="text-lg font-semibold text-green-800">
                Client Insight
              </h2>
              <p className="text-sm text-green-700 mt-1">
                Click for more information
              </p>
            </div>
          </div>
        </div>
        
        {/* Client ID display */}
        {clientId && <p className="text-green-600 text-sm mb-3">Client ID reconocido: {clientId}</p>}
        
        {/* Enhanced Client Insight display */}
        {insightMutation.isPending && (
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse delay-100"></div>
              <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse delay-200"></div>
              <span className="text-gray-600">Cargando datos del cliente...</span>
            </div>
          </div>
        )}
        
        {clientInsight && (
          <div className="h-[calc(100vh-12rem)] overflow-hidden">
            <EnhancedClientInsight clientInsight={clientInsight} />
          </div>
        )}
        
        {/* Popup that appears when card is clicked */}
        {showPopup && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 border-2 border-green-500 animate-fadeIn">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Smart Recommendations</h3>
            <p className="text-gray-700">More Smart Recommendations coming soon!</p>
            <button 
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        )}
        
        {/* Overlay that darkens the screen when popup is visible */}
        {showPopup && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowPopup(false)}
          />
        )}
      </div>

      {/* RIGHT PANEL - Decreased width to 40% */}
      <div className="w-2/5 flex flex-col">
        <div className="p-4 pb-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl"></span> Howl AI (Smart Recommendation: Client Insight)
          </h2>
        </div>
        <div className="flex-1 p-4 pt-2 flex flex-col">
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
      
      {/* Add enhanced custom animation keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes cardPulse {
          0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.2); }
          70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }
        
        @keyframes borderGlow {
          0% { border-color: rgba(167, 243, 208, 0.5); }
          50% { border-color: rgba(16, 185, 129, 0.8); }
          100% { border-color: rgba(167, 243, 208, 0.5); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes wave {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes sweep {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .animate-float {
          animation: float 3s infinite ease-in-out;
        }
        
        .animate-wave {
          animation: wave 8s infinite linear;
        }
        
        .animate-sweep {
          animation: sweep 3s infinite ease-in-out;
        }
        
        .animate-pulse-subtle {
          animation: cardPulse 3s infinite;
        }
      `}</style>
    </div>
  );
}