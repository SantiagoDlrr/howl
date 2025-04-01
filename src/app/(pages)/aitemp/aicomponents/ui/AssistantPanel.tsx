import React, { useState } from 'react';
import { ChatMessage } from '../../types/types';

interface AssistantPanelProps {
  transcriptAvailable: boolean;
  messages: ChatMessage[];
  loading: boolean;
  userInput: string;
  setUserInput: (input: string) => void;
  onSendMessage: (message: string) => void;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({
  transcriptAvailable,
  messages,
  loading,
  userInput,
  setUserInput,
  onSendMessage
}) => {
  // Handle Enter key in chat input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(userInput);
    }
  };

  // Prepare example message content - this would be dynamic in a real app


  return (
    <div className="w-72 border-l border-gray-200 flex flex-col h-screen">
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <h2 className="text-lg font-medium">Asistente Howl AI</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          // Show message history
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`rounded-lg p-3 max-w-full break-words ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white ml-4' 
                    : 'bg-gray-100 text-gray-800 mr-4'
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 text-gray-800 rounded-lg p-3 mr-4">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            )}
          </div>
        ) : transcriptAvailable ? (
          // Show example content when transcript is available but no messages yet
          <div className="p-4">
            <div className="flex mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                <img src="/avatar-placeholder.jpg" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="font-medium">Hector, RDZ</div>
            </div>
            


            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="mb-2 text-sm font-medium">
                <div className="flex items-center text-purple-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Howl AI
                </div>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-800 mb-1">Escribe una pregunta.</p>
            </div>
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">
               
              </div>
            </div>
          </div>
        ) : (
          // Show placeholder when no transcript available
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center text-gray-500 max-w-xs">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Escribe una pregunta y nuestra IA resumirá al instante los puntos clave, recordará detalles, redactará contenido y descubrirá información a partir de la transcripción.</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder={transcriptAvailable ? "Pregúntame Algo..." : "Cuéntame"}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={!transcriptAvailable}
          />
          <button
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              !transcriptAvailable || !userInput.trim() ? 'text-gray-400' : 'text-purple-600 hover:text-purple-800'
            }`}
            onClick={() => userInput.trim() && onSendMessage(userInput)}
            disabled={!transcriptAvailable || !userInput.trim()}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantPanel;