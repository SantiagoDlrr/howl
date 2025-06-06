"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import EnhancedClientInsight from "@/app/_components/sr/EnhancedClientInsight";
import type { ClientInsight } from "@/app/utils/types/ClientInsight";
import { Brain, Sparkles, Send, MessageCircle, Zap, User, X } from "lucide-react";

// Markdown parser component - COPIED FROM PREVIOUS FILE
const MarkdownText = ({ text }: { text: string }) => {
  const parseMarkdown = (content: string) => {
    // Handle headers
    content = content.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2 first:mt-0">$1</h3>');
    content = content.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-3 first:mt-0">$1</h2>');
    content = content.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">$1</h1>');
    
    // Handle bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    // Handle italic text
    content = content.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>');
    
    // Handle bullet points
    content = content.replace(/^[\-\*] (.*$)/gim, '<li class="ml-4 text-gray-700">• $1</li>');
    
    // Wrap consecutive list items in ul
    // This regex is a bit simplistic and might wrap non-list items if they contain <li> tags.
    // For basic Markdown, it's usually sufficient.
    content = content.replace(/(<li.*<\/li>)/gs, '<ul class="space-y-1 my-3">$1</ul>');
    
    // Handle line breaks by converting double newlines to new paragraphs
    content = content.replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-3">');
    content = '<p class="text-gray-700 leading-relaxed mb-3">' + content + '</p>';
    
    // Handle numbered lists
    content = content.replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 text-gray-700">$1. $2</li>');
    
    return content;
  };

  return (
    <div 
      // Apply prose styles for general typography
      // `prose-sm` makes the default text smaller to fit chat bubble better
      // `max-w-none` ensures it doesn't limit its width
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }}
    />
  );
};


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
            // Ensure the message is always a string, even if parsed.message is null
            const message = parsed.message ? String(parsed.message) : String(res.response);

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
            setChatHistory((prev) => [...prev, `AI: ${String(res.response)}`]);
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
                      {/* Conditional rendering for MarkdownText */}
                      {isUser ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{cleanMessage}</p>
                      ) : (
                        <MarkdownText text={cleanMessage} />
                      )}
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