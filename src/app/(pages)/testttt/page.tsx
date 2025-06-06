// "use client";

// import { useState } from "react";
// import { api } from "@/trpc/react";
// import EnhancedClientInsight from "@/app/_components/sr/EnhancedClientInsight";
// import type { ClientInsight } from "@/app/utils/types/ClientInsight";


// export default function SmartRecommendationsPage() {
//   const [chatHistory, setChatHistory] = useState<string[]>([]);
//   const [chatInput, setChatInput] = useState("");
//   const [clientId, setClientId] = useState<string | null>(null);
//   const [clientInsight, setClientInsight] = useState<ClientInsight | null>(null);
//   const [showPopup, setShowPopup] = useState(false);

//   const chatMutation = api.clientResolver.conversationalResolve.useMutation();
//   const insightMutation = api.clientInsight.getClientInsight.useMutation();

//   const handleChatMessage = async () => {
//     if (!chatInput.trim()) return;

//     setChatHistory((prev) => [...prev, `Tú: ${chatInput}`]);

//     chatMutation.mutate(
//       { message: chatInput },
//       {
//         onSuccess: (res) => {
//           setChatInput("");

//           try {
//             const parsed = JSON.parse(res.response);
//             const message = parsed.message || res.response;

//             setChatHistory((prev) => [...prev, `AI: ${message}`]);
//             //rrr
//             if (parsed?.type === "client" && parsed?.id) {
//               setClientId(parsed.id);
//               insightMutation.mutate({ id: parsed.id }, {
//                 onSuccess: (insight) => {
//                   const transformedInsight: ClientInsight = {
//                     ...insight,
//                     reports: insight.reports.map((report) => ({
//                       id: report.id.toString(),
//                       name: report.name,
//                       date: report.date,
//                       duration: report.duration,
//                       report: {
//                         sentiment: report.report.sentiment,
//                         rating: report.report.rating,
//                         summary: report.report.summary,
//                         feedback: report.report.feedback,
//                         keyTopics: report.report.keyTopics,
//                         emotions: report.report.emotions,
//                       },
//                       transcript: report.transcript?.map((t) => ({
//                         speaker: t.speaker,
//                         text: t.text,
//                       })),
//                     })),
//                   };
//                   setClientInsight(transformedInsight);
//                 },
//               });
//             }
//           } catch {
//             // respuesta plana (no JSON)
//             setChatHistory((prev) => [...prev, `AI: ${res.response}`]);
//           }
//         },
//       }
//     );
//   };

//   const handleCardClick = () => {
//     setShowPopup(true);
//     setTimeout(() => setShowPopup(false), 3000); // Auto-hide after 3 seconds
//   };

//   return (
//     <div className="flex w-full pt-16 h-[calc(100vh-4rem)]">
//       {/* LEFT PANEL - Increased width to 60% */}
//       <div className="w-3/5 p-4 overflow-y-auto border-r">
//         {/* Animated Card Header */}
//         <div 
//           className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mb-4 shadow-md cursor-pointer relative overflow-hidden animate-pulse-subtle transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] border border-green-200"
//           onClick={handleCardClick}
//           style={{
//             animation: "cardPulse 3s infinite, borderGlow 2s infinite"
//           }}
//         >
//           {/* Full card background animation */}
//           <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 via-green-50/30 to-green-100/50 animate-wave" 
//                style={{
//                  backgroundSize: "200% 100%",
//                  animation: "wave 8s infinite linear"
//                }}
//           />
          
//           {/* Moving shine effect */}
//           <div className="absolute inset-0 overflow-hidden">
//             <div className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 skew-x-12 animate-sweep" 
//                  style={{
//                    left: "-100%",
//                    animation: "sweep 3s infinite ease-in-out"
//                  }}
//             />
//           </div>
          
//           {/* Content */}
//           <div className="relative z-10 flex items-center">
//             <span className="text-2xl mr-2 animate-float" style={{ animation: "float 3s infinite ease-in-out" }}>🧠</span>
//             <div>
//               <h2 className="text-lg font-semibold text-green-800">
//                 Client Insight
//               </h2>
//               <p className="text-sm text-green-700 mt-1">
//                 Click for more information
//               </p>
//             </div>
//           </div>
//         </div>
        
//         {/* Client ID display */}
//         {clientId && <p className="text-green-600 text-sm mb-3">Client ID reconocido: {clientId}</p>}
        
//         {/* Enhanced Client Insight display */}
//         {insightMutation.isPending && (
//           <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
//               <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse delay-100"></div>
//               <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse delay-200"></div>
//               <span className="text-gray-600">Cargando datos del cliente...</span>
//             </div>
//           </div>
//         )}
        
//         {clientInsight && (
//           <div className="h-[calc(100vh-12rem)] overflow-hidden">
//             <EnhancedClientInsight clientInsight={clientInsight} />
//           </div>
//         )}
        
//         {/* Popup that appears when card is clicked */}
//         {showPopup && (
//           <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 border-2 border-green-500 animate-fadeIn">
//             <h3 className="text-lg font-semibold text-green-800 mb-2">Smart Recommendations</h3>
//             <p className="text-gray-700">More Smart Recommendations coming soon!</p>
//             <button 
//               className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//               onClick={() => setShowPopup(false)}
//             >
//               Close
//             </button>
//           </div>
//         )}
        
//         {/* Overlay that darkens the screen when popup is visible */}
//         {showPopup && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={() => setShowPopup(false)}
//           />
//         )}
//       </div>

//       {/* RIGHT PANEL - Decreased width to 40% */}
//       <div className="w-2/5 flex flex-col">
//         <div className="p-4 pb-0">
//           <h2 className="text-lg font-semibold flex items-center gap-2">
//             <span className="text-xl"></span> Howl AI (Smart Recommendation: Client Insight)
//           </h2>
//         </div>
//         <div className="flex-1 p-4 pt-2 flex flex-col">
//           <div className="flex-1 bg-gray-100 rounded p-3 overflow-y-auto">
//             {chatHistory.map((msg, idx) => (
//               <p key={idx} className="text-sm whitespace-pre-wrap mb-2">
//                 {msg}
//               </p>
//             ))}
//           </div>
//           <div className="mt-4 flex gap-2">
//             <input
//               type="text"
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               placeholder="Escribe algo..."
//               className="w-full p-2 border rounded"
//             />
//             <button
//               onClick={handleChatMessage}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//             >
//               Enviar
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Add enhanced custom animation keyframes */}
//       <style jsx global>{`
//         @keyframes shimmer {
//           0% { background-position: -200% 0; }
//           100% { background-position: 200% 0; }
//         }
        
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes cardPulse {
//           0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.2); }
//           70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
//         }
        
//         @keyframes borderGlow {
//           0% { border-color: rgba(167, 243, 208, 0.5); }
//           50% { border-color: rgba(16, 185, 129, 0.8); }
//           100% { border-color: rgba(167, 243, 208, 0.5); }
//         }
        
//         @keyframes float {
//           0% { transform: translateY(0px); }
//           50% { transform: translateY(-5px); }
//           100% { transform: translateY(0px); }
//         }
        
//         @keyframes wave {
//           0% { background-position: 0% 0; }
//           100% { background-position: 200% 0; }
//         }
        
//         @keyframes sweep {
//           0% { left: -100%; }
//           50% { left: 100%; }
//           100% { left: 100%; }
//         }
        
//         .animate-shimmer {
//           animation: shimmer 2s infinite linear;
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-in-out;
//         }
        
//         .animate-float {
//           animation: float 3s infinite ease-in-out;
//         }
        
//         .animate-wave {
//           animation: wave 8s infinite linear;
//         }
        
//         .animate-sweep {
//           animation: sweep 3s infinite ease-in-out;
//         }
        
//         .animate-pulse-subtle {
//           animation: cardPulse 3s infinite;
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import EnhancedClientInsight from "@/app/_components/sr/EnhancedClientInsight";
import type { ClientInsight } from "@/app/utils/types/ClientInsight";
import { Brain, Sparkles, Send, MessageCircle, Zap, User, X } from "lucide-react";

export default function SmartRecommendationsPage() {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientInsight, setClientInsight] = useState<ClientInsight | null>(null);
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
                onSuccess: (insight) => {
                  const transformedInsight: ClientInsight = {
                    ...insight,
                    reports: insight.reports.map((report) => ({
                      id: report.id.toString(),
                      name: report.name,
                      date: report.date,
                      duration: report.duration,
                      report: {
                        sentiment: report.report.sentiment,
                        rating: report.report.rating,
                        summary: report.report.summary,
                        feedback: report.report.feedback,
                        keyTopics: report.report.keyTopics,
                        emotions: report.report.emotions,
                      },
                      transcript: report.transcript?.map((t) => ({
                        speaker: t.speaker,
                        text: t.text,
                      })),
                    })),
                  };
                  setClientInsight(transformedInsight);
                },
              });
            }
          } catch {
            setChatHistory((prev) => [...prev, `AI: ${res.response}`]);
          }
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatMessage();
    }
  };

  const handleCardClick = () => {
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="flex w-full pt-6 h-[calc(100vh-1.5rem)] max-w-7xl mx-auto px-6 gap-6">
        {/* LEFT PANEL - Client Insights */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B351FF] to-[#9d44e8] bg-clip-text text-transparent">
                  Smart Recommendations
                </h1>
                <p className="text-gray-600">AI-powered client insights and analysis</p>
              </div>
            </div>
          </div>

          {/* Animated Client Insight Card */}
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 p-6 mb-6 cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
            onClick={handleCardClick}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#B351FF]/5 via-purple-100/30 to-[#B351FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-2 h-2 bg-[#B351FF]/20 rounded-full animate-float-1" style={{ top: '20%', left: '10%' }} />
              <div className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float-2" style={{ top: '60%', left: '80%' }} />
              <div className="absolute w-3 h-3 bg-[#B351FF]/10 rounded-full animate-float-3" style={{ top: '80%', left: '20%' }} />
            </div>

            {/* Moving shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -left-full group-hover:left-full transition-all duration-1000" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B351FF]/20 to-purple-200/50 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-[#B351FF] animate-pulse" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Client Insight Dashboard
                </h2>
                <p className="text-gray-600">
                  Click to explore upcoming smart recommendation features
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-[#B351FF] rounded-full animate-pulse" />
                  <span className="text-sm text-[#B351FF] font-medium">AI-Powered Analysis</span>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-[#B351FF] transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Client ID Display */}
          {clientId && (
            <div className="bg-[#B351FF]/10 border border-[#B351FF]/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#B351FF]" />
                <span className="text-[#B351FF] font-medium">Client ID: {clientId}</span>
              </div>
            </div>
          )}
          
          {/* Enhanced Client Insight Loading */}
          {insightMutation.isPending && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 flex flex-col items-center justify-center">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-[#B351FF] rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-[#B351FF] rounded-full animate-bounce delay-100" />
                <div className="w-3 h-3 bg-[#B351FF] rounded-full animate-bounce delay-200" />
              </div>
              <p className="text-gray-600 font-medium">Loading client insights...</p>
              <p className="text-gray-500 text-sm">AI is analyzing client data</p>
            </div>
          )}
          
          {/* Enhanced Client Insight Display */}
          {clientInsight && (
            <div className="flex-1 overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
              <EnhancedClientInsight clientInsight={clientInsight} />
            </div>
          )}
        </div>

        {/* RIGHT PANEL - AI Chat */}
        <div className="w-96 flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-[#B351FF] to-[#9d44e8] text-white">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-semibold">Howl AI Assistant</h2>
                <p className="text-purple-100 text-sm">Smart Recommendations & Client Insights</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#B351FF]/20 to-purple-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-[#B351FF]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Help</h3>
                <p className="text-gray-600 text-sm">Start a conversation to get AI-powered insights about your clients</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => {
                const isUser = msg.startsWith('Tú:');
                const cleanMessage = msg.replace(/^(Tú:|AI:)\s*/, '');
                
                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      isUser 
                        ? 'bg-gradient-to-r from-[#B351FF] to-[#9d44e8] text-white ml-4' 
                        : 'bg-white border border-gray-200 text-gray-800 mr-4 shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{cleanMessage}</p>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Typing indicator when loading */}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 mr-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#B351FF] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#B351FF] rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-[#B351FF] rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-gray-200/50 bg-white/50">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about clients, insights, or recommendations..."
                  className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B351FF]/20 focus:border-[#B351FF] transition-all resize-none bg-white/80 backdrop-blur-sm"
                  rows={2}
                  disabled={chatMutation.isPending}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {chatInput.length}/500
                </div>
              </div>
              <button
                onClick={handleChatMessage}
                disabled={!chatInput.trim() || chatMutation.isPending}
                className="bg-gradient-to-r from-[#B351FF] to-[#9d44e8] hover:from-[#9d44e8] hover:to-[#8b3dd9] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white p-4 rounded-xl transition-all duration-200 flex items-center justify-center hover:shadow-lg hover:scale-105 disabled:scale-100 disabled:shadow-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Popup Modal */}
      {showPopup && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setShowPopup(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl z-50 border border-gray-200 animate-scaleIn max-w-md w-full mx-4">
            <div className="text-center">
              {/* Header */}
              <div className="w-20 h-20 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Recommendations</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Advanced AI-powered client insights and personalized recommendations are coming soon. 
                Get ready for the future of client relationship management!
              </p>
              
              {/* Features Preview */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-2 h-2 bg-[#B351FF] rounded-full" />
                  <span className="text-sm text-gray-700">Predictive client behavior analysis</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-2 h-2 bg-[#B351FF] rounded-full" />
                  <span className="text-sm text-gray-700">Automated recommendation engine</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-2 h-2 bg-[#B351FF] rounded-full" />
                  <span className="text-sm text-gray-700">Real-time sentiment tracking</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#B351FF] to-[#9d44e8] text-white rounded-xl hover:from-[#9d44e8] hover:to-[#8b3dd9] transition-all duration-200 font-medium hover:shadow-lg hover:scale-105"
                  onClick={() => setShowPopup(false)}
                >
                  Got it!
                </button>
                <button 
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setShowPopup(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Enhanced CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-180deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(90deg); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-float-1 {
          animation: float-1 6s infinite ease-in-out;
        }
        
        .animate-float-2 {
          animation: float-2 8s infinite ease-in-out;
        }
        
        .animate-float-3 {
          animation: float-3 7s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}